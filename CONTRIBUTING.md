# Contributing to lecfetch

Rules and conventions for this project. The main goal is **learning**: TypeScript,
Node.js, CLI development, and how Linux exposes system data.

If this file and `AGENTS.md` ever disagree, `AGENTS.md` wins. When a rule
changes, update both files in the same commit.

## Language

- Code, identifiers, and commit messages: **American English**.
- Documentation (`README.md`, `CONTRIBUTING.md`, `NOTES.md`): **American English**.
- Conversations in this project: Spanish is fine.

## Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
type(optional-scope): imperative summary
```

Valid types:

| Type | Use for |
| --- | --- |
| `feat` | A new feature or a new info module |
| `fix` | A bug fix |
| `docs` | Documentation only (`README.md`, `NOTES.md`, ...) |
| `chore` | Tooling, config, dependency updates |
| `refactor` | Code change without changing behavior |
| `test` | Adding or updating tests |
| `style` | Formatting, no logic change |
| `perf` | Performance improvement |

Examples:

```
feat(memory): read MemAvailable from /proc/meminfo
fix: handle missing os-release file
docs: document /proc/uptime format
chore: enable strict mode in tsconfig
```

Rules:

- Summary in imperative mood: "add", not "added" or "adds".
- No trailing period.
- 72 characters max.
- Small commits: one idea per commit.
- Never commit broken code: run the verification below first.

## Verification before every commit

```bash
pnpm typecheck   # tsc --noEmit: zero type errors
pnpm test        # all tests pass
pnpm dev         # output looks correct
```

## Git workflow

- One branch per phase: `feat/phase-0-setup`, `feat/phase-1-research`, ...
- Merge the branch into `main` when the phase is done, then delete it.
- Never force-push.
- Pull before pushing if `origin/main` moved.

## Principles

### Zero runtime dependencies

The `dependencies` field in `package.json` stays empty. Only `devDependencies`
are allowed (`typescript`, `tsx`, test tooling). Node.js built-ins are always
allowed. Never copy code from npm packages into `src/`.

### No `child_process`

Never import `node:child_process` (no `exec`, `spawn`, `fork`, `execFile`).
The whole point of the project is reading Linux data directly:

```bash
# never do this
exec('uname -r')

# do this instead
readFile('/proc/sys/kernel/osrelease', 'utf-8')
```

Allowed: `node:fs/promises`, `node:os`, `node:util`, `process.env`.

Note: `node:os` is allowed **only in Phase 2** as a deliberate first step. Every
value must be replaced by direct file reading in Phase 3.

### Strict TypeScript, no `any`

`strict: true` never gets disabled. If a type is hard to write, that is a signal
that the design can improve.

### Async file access

Only `fs/promises`. Never `readFileSync`: synchronous I/O blocks the event loop.

### Modules never throw

Expected conditions (a file does not exist, a field is missing) return `null`
instead of throwing. Missing data is displayed as `unknown` and the program
keeps running. Only unrecoverable programmer errors may crash it.

### Stay in scope

Do not add features, files, or dependencies that were not requested. When in
doubt, ask before expanding scope.

## Tests

- From Phase 3 onward, every module that reads `/proc` or `/sys` ships with a
  test and a fixture.
- Fixtures live in `tests/fixtures/` and are plain copies of the real files.
- Use Node's built-in `node:test` runner.
- Tests must pass on any Linux machine: never read the live `/proc` in tests.

## Security and privacy

- Never commit tokens, keys, or `.env` files. GitHub credentials live in the
  `gh` keyring.
- Never read or print other processes' `/proc/<pid>/environ`.

## Documentation

| File | Purpose |
| --- | --- |
| `AGENTS.md` | Imperative rules for AI agents |
| `CONTRIBUTING.md` | This file: rules for humans, with examples |
| `NOTES.md` | Research notes: where each value comes from |
| `README.md` | User-facing usage |

## Phases

| # | Phase | Goal |
| --- | --- | --- |
| 0 | Project setup | TypeScript compiles, entry point runs |
| 1 | Research | `NOTES.md` documents every data source |
| 2 | MVP | Basic info displayed via `node:os` |
| 3 | Direct reading | Every value read from `/proc`, `/etc`, with tests |
| 4 | Modularization | One module per value in `src/modules/` |
| 5 | Presentation | ANSI colors, ASCII logo, alignment |
| 6 | CLI | `--help`, `--version`, `--json` |
| 7 | Portability | Works on other distros, never crashes |
| 8 | Refactor | Performance, tests, README |
