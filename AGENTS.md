# Project instructions — lecfetch

lecfetch is a Neofetch-style system information tool for Linux, built from scratch
with TypeScript and Node.js. The main goal is learning: TypeScript, Node.js, CLI
development, and how Linux exposes system data.

## Language

- Write code, comments, commit messages, and documentation in American English.
- Reply to the user in Spanish.
- No accented characters in file names or identifiers (`NOTES.md`, not `NOTAS.md`).

## Learning context

- The human is learning TypeScript and Linux from scratch.
- Prefer clear code over clever code. No advanced idioms without a brief comment.
- When a value comes from an unfamiliar kernel file, document its format in `NOTES.md`.
- Explain new concepts in plain language when introducing them.
- Never use `any` to make it work: a hard type is a design signal.

## Environment and target

- Target: Linux only. Developed on Linux Mint 22.3, kernel 6.8.
- Tooling: Node.js 24, pnpm, Git. No sudo is available to the agent.
- Do not assume a graphical session, Docker, or network access at runtime.
- macOS and Windows are out of scope.

## Commits

- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `style:`, `perf:`.
- Subject: 72 chars max, imperative mood ("add", not "added"), no trailing period.
- Optional lowercase scope: `feat(memory): handle missing MemAvailable`.
- Small commits: one commit = one idea.
- Never commit broken code: verification must pass before every commit.

## Git workflow

- One branch per phase: `feat/phase-0-setup` → merge into `main` → delete branch.
- Never force-push. Pull before push if `origin/main` moved.
- Push after each verified commit.

## Principles

- Zero runtime dependencies: the `dependencies` field in `package.json` stays
  empty. `devDependencies` are allowed (`typescript`, `tsx`, test tooling).
  Node.js built-ins (`node:fs`, `node:os`, `node:util`) are always allowed.
  Never copy vendor code from npm into `src/`.
- Never import `node:child_process` (no `exec`, `spawn`, `fork`, `execFile`).
  Read `/proc`, `/sys`, and `/etc` directly instead of running `uname`, `lscpu`,
  `free`, etc.
- `node:os` is allowed only in Phase 2 as a deliberate stepping stone; every
  value must be replaced by direct file reading in Phase 3.
- TypeScript `strict: true` stays enabled. Zero `any`.
- Only `fs/promises`; never `readFileSync` (it blocks the event loop).
- Modules never throw: no `throw` for expected conditions (missing file, missing
  field). Missing data returns `null`, renders as `unknown`, and the program
  keeps running. The only acceptable crash is an unrecoverable programmer error.
  No unhandled promise rejections.
- Do not add features, files, or dependencies that were not requested.
  When in doubt, ask before expanding scope.

## Tests

- From Phase 3 onward: every new `/proc` or `/sys` module ships with a test and
  a fixture file in `tests/fixtures/` (plain copies of the real files).
- Use the built-in `node:test` runner.
- Tests must pass on any Linux machine: never read the live `/proc` in tests.

## Verification

Before every commit, all of these must exit 0:

1. `pnpm typecheck`
2. `pnpm test`
3. Output looks correct when running `pnpm dev`

A phase is done when verification passes, the work is merged into `main`, and
the branch is deleted.

## Security and privacy

- Never commit tokens, keys, or `.env` files. GitHub credentials live in the
  `gh` keyring.
- Never read or print other processes' `/proc/<pid>/environ`.

## Documentation hierarchy

- `AGENTS.md`: imperative rules for agents. If `AGENTS.md` and `CONTRIBUTING.md`
  disagree, `AGENTS.md` wins.
- `CONTRIBUTING.md`: human-facing rules with examples.
- `NOTES.md`: research notes (where each system value comes from, file formats).
- `README.md`: user-facing usage.
- When a rule changes, update `AGENTS.md` and `CONTRIBUTING.md` in the same commit.

## Phases

0. Project setup (TypeScript, `tsconfig.json`, entry point).
1. Research: document where each value comes from in `NOTES.md`.
2. MVP using the Node.js `node:os` API.
3. Replace each value with direct `/proc` and `/etc` reading, with tests.
4. Modularize into `src/modules/`.
5. Presentation: ANSI colors, ASCII logo, alignment.
6. CLI arguments: `--help`, `--version`, `--json`.
7. Portability across Linux distributions (fallbacks, never crash).
8. Refactoring, performance, and documentation.
