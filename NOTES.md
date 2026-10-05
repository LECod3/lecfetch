# NOTES.md — System data research

Where each value comes from, its exact format, and how to parse it. This is the
map for Phase 3 (direct file reading). Values below are from the dev machine;
they change at runtime, so never treat them as constants.

Machine: Linux Mint 22.3 (Zena), kernel 7.0.0-38-generic, Intel i5-10310U.

---

## OS / Distribution — `/etc/os-release`

- **Format:** `KEY=value` or `KEY="quoted value"`, one per line.
- **Field of interest:** `PRETTY_NAME` → `Linux Mint 22.3`.
- **Other useful fields:** `ID` (machine-friendly, e.g. `linuxmint`), `VERSION_ID`,
  `ID_LIKE` (base distros: `ubuntu debian` — useful for detecting the family).
- **Parsing note:** values may or may not be quoted, so strip `"` if present.
- **Fallback:** if `/etc/os-release` is missing, try `/etc/lsb-release`
  (`DISTRIB_DESCRIPTION=`), else return `null`.
- **Caveat:** `os-release` is a systemd standard; it exists on virtually every
  modern distro, but not on minimal/busybox systems.

## Kernel — `/proc/sys/kernel/osrelease`

- **Format:** plain text, a single line, no quotes. Example: `7.0.0-38-generic`.
- **Equivalent to** `uname -r`.
- **Related file:** `/proc/version` holds a longer string
  (`Linux version 7.0.0-38-generic ... (gcc ...)`) — prefer `osrelease` for a
  short version.
- **Parsing note:** trim whitespace/newline. That's all.

## Hostname — `/proc/sys/kernel/hostname`

- **Format:** plain text, single line. Example: `Gneisenau`.
- **Equivalent to** `hostname`.
- **Alternative:** `os.hostname()` in Node returns the same value.

## CPU — `/proc/cpuinfo`

- **Format:** blocks of `key<tab>: value` lines, separated by **blank lines**.
  One block per **logical** CPU (hyperthreading counts as 2).
- **Fields of interest:**
  - `model name` → `Intel(R) Core(TM) i5-10310U CPU @ 1.70GHz` (the display name)
  - `cpu cores` → physical cores per socket (`4`)
  - `siblings` → logical CPUs per socket (`8`)
  - `processor` → index of the block (`0` ... `7`)
- **Counting:** number of `processor` lines = total logical CPUs (`8`).
- **Parsing gotchas:**
  - The separator is tabs for alignment; do not split on spaces blindly.
    Split on the first `:` and trim.
  - The same `model name` repeats in every block — read it from the **first**
    block only.
  - `cpu MHz` changes constantly (frequency scaling: `700.011` here). Never
    display it as a stable value without rounding.
  - **Portability:** on some ARM boards there is no `model name`; the field may
    be `Processor`, `Hardware`, or `model`. Return `null` when absent rather
    than crashing.

## RAM — `/proc/meminfo`

- **Format:** `Key:      value kB`, whitespace-padded so columns align.
- **Fields of interest:**
  - `MemTotal` → total physical RAM (`7718660 kB`)
  - `MemAvailable` → estimated RAM available for new workloads
    (`5264948 kB`) — the right number to compute "used" = `MemTotal - MemAvailable`
- **Units:** `kB` here means **kibibytes** (1024 bytes), so dividing by 1024
  gives MiB, and by 1024² gives GiB. Node's `os.totalmem()` reports bytes.
- **Parsing gotchas:**
  - Do not use `MemFree` for "available": it excludes reclaimable cache and
    makes usage look much higher than it is.
  - `MemAvailable` exists since kernel 3.14 — effectively always present on
    a modern distro, but fall back to `MemFree + Cached + Buffers` if missing.
  - Strip the trailing `kB` unit before converting; some fields (like
    `HugePages_Total`) have **no unit** at all.

## Uptime — `/proc/uptime`

- **Format:** two space-separated numbers, single line.
  `10645.35 64873.46`
  - 1st value: seconds since boot (`10645.35` ≈ 2 h 57 min).
  - 2nd value: total **idle** time summed across all CPUs — not system uptime.
- **Parsing note:** take the first value, floor it to an integer, then format
  as `2h 57m`. Never print raw seconds.
- **Related:** `/proc/stat` line `btime` gives the boot timestamp in epoch
  seconds — useful later if we want the boot date.

## Architecture — no `/proc` file

- **Source:** Node's `process.arch` (or `os.arch()`) → `x64`.
- **Why no file:** architecture is a property of the running kernel, not a
  tunable, so `/proc/sys/kernel` has nothing for it.
- **Mapping needed:** `process.arch` uses Node's names, not `uname -m`'s:

  | `process.arch` | `uname -m` (what neofetch shows) |
  | --- | --- |
  | `x64` | `x86_64` |
  | `arm64` | `aarch64` |
  | `arm` | `armv7l` |
  | `ia32` | `i686` |

- **Decision:** map in code; do **not** shell out to `uname` (project principle).

## Shell — `$SHELL` env var + parent process

- **`$SHELL`** → `/bin/bash`. This is the **login/default** shell from
  `/etc/passwd`, not necessarily the one currently running.
- **Current shell:** the parent process. Read `/proc/<ppid>/cmdline`
  (null-separated!) or `/proc/<ppid>/comm`.
- **Caveat — important:** the parent is not always a shell. When a program
  spawns a subshell, `$PPID` points at the program. Observed on this machine:
  running through the agent gave parent `opencode serve`, and in a terminal
  opened by an app the parent could be the app itself.
- **Strategy:** show `$SHELL` (predictable), and only walk the process tree if
  we later want the *actual* running shell.

## Terminal — env vars

- **`$TERM`** → `xterm-256color`: the **emulation** the terminal advertises
  (what escape sequences it understands), not the terminal's name.
- **`$TERM_PROGRAM`** → `zed`: the actual terminal application (this var is
  not universal — iTerm2, VS Code, and Zed set it; gnome-terminal does not).
- **`$COLORTERM`** → `truecolor`: the terminal supports 24-bit color. Useful
  later to decide whether to emit truecolor ANSI codes.
- **Fallback chain:** `$TERM_PROGRAM` → parent process name from
  `/proc/<ppid>/comm` (e.g. `gnome-terminal-server`, `tmux`) → `$TERM` → `null`.
- **Caveat:** under `tmux`/`screen`, `$TERM` becomes `tmux-256color` or
  `screen-256color` — the multiplexer hides the real terminal.

---

## Summary table

| Data | Source | Format | Key field / unit |
| --- | --- | --- | --- |
| Distribution | `/etc/os-release` | `KEY="value"` | `PRETTY_NAME` |
| Kernel | `/proc/sys/kernel/osrelease` | single line | whole file |
| Hostname | `/proc/sys/kernel/hostname` | single line | whole file |
| CPU | `/proc/cpuinfo` | blocks split by blank lines | `model name` |
| RAM | `/proc/meminfo` | `Key: value kB` | `MemTotal`, `MemAvailable` |
| Uptime | `/proc/uptime` | `sec idle_sec` | 1st number (seconds) |
| Architecture | `process.arch` | enum | map `x64` → `x86_64` |
| Shell | `$SHELL` | env path | fallback: `/proc/<ppid>/` |
| Terminal | `$TERM*` | env vars | `$TERM_PROGRAM`, `$COLORTERM` |

## Open questions for later phases

- GPU: expected under `/sys/class/drm/` — not researched yet (Phase 4).
- Disk: `/proc/mounts` + `fs.statfs()` — not researched yet (Phase 4).
- Battery: `/sys/class/power_supply/` — not researched yet (Phase 4).
