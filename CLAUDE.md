# CLAUDE.md

Operational rules for working in this repo. Detailed background lives in `docs/` — read the relevant file before non-trivial work:

- **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** — system design: model + two view layers, the config→sash compile, the `store` bag, rendering/reconcile, interaction features, public API.
- **[`docs/context/conventions.md`](docs/context/conventions.md)** — full coding conventions (terminology, naming, comments, debug sentinels, interaction code, dev pages) with rationale. The sections below are the checklist; that file is the _why_.
- **[`docs/context/react-bwin-integration.md`](docs/context/react-bwin-integration.md)** — the downstream `react-bwin` contract; check before changing internals, `sash.store` keys, or actions defaults.
- **[`docs/TECH_DEBT.md`](docs/TECH_DEBT.md)** — known design flaws and compromises. Check before reworking an area; update it when you take on or pay down debt. (Bugs/features → GitHub issues.)

## Git

- **Never `git commit` or `git push` unless the user explicitly asks for it in that same turn.** Approval never carries over between turns — ask every time.
  - A request to "create a PR", "fix this", or a shared error message is **not** authorization to commit or push. Do the work, then ask before committing (e.g. "Want me to commit and push?").
  - Only an explicit yes/instruction in the current turn counts. When in doubt, ask.
- When committing, print the commit message in your reply.
- **No Claude attribution trailers** — never add `Co-Authored-By: Claude` or `Generated with Claude Code` (or similar) to commit messages or PR descriptions.
- Type commits that only touch `dev/` as plain `chore:` — never `feat:`/`fix:`, no `(dev)` scope. It's test scaffolding, not library source.

## Tooling

- **pnpm** is the package manager. Dev/test/`react-bwin`-linking commands live in [`CONTRIBUTING.md`](CONTRIBUTING.md); release steps in [`RELEASING.md`](RELEASING.md) (the workflow pushes the `vX.Y.Z` tag — never tag by hand). Don't re-derive either.
- `.env.local` is **gitignored but required for `pnpm dev`**: `src/sash.js` reads `VITE_DEFAULT_SASH_MIN_WIDTH`/`_HEIGHT` via `Number(import.meta.env…)`, so a fresh checkout silently yields `minWidth`/`minHeight` of `NaN`. Only `production` mode is covered by the committed `.env.production` — `development` and `test` load nothing, and the suite passes regardless (no test asserts sash minimums), so tests won't warn you. Copy `.env.production`'s values.
- `@` resolves to `src/` (aliased in both `vite.config.js` and `vitest.config.js`); prettier runs on commit via lint-staged, so don't hand-format.

## Testing

- Don't run tests or builds after finishing a feature or fix unless asked.

## Conventions (checklist)

Full detail + rationale in [`docs/context/conventions.md`](docs/context/conventions.md).

- **Terminology** — use the window-construction metaphor precisely; glossary in [`docs/ARCHITECTURE.md` §1](docs/ARCHITECTURE.md#1-the-window-construction-metaphor). Plain "glass" by default; "attached glass" only when contrasting with detached.
- **Naming** — DOM-element vars get an `El` suffix with a specific noun (`activeGlassEl`, not `activeEl`); accessors named `get<Noun>`; constants name their context (`MIN_RESIZE_WIDTH`, not `MIN_WIDTH`); prefer established domain terms.
- **Comments** — only when they add what the code doesn't say; ≤2 lines / 100 chars; prefix a genuinely longer one with `RATIONAL:`; wrap identifiers in backticks.
- **Debug sentinels** — repeating-digit literals (`222`, `333`) in default/fallback paths are intentional tripwires, not magic numbers. Don't tidy them. If one surfaces downstream, a guard upstream was bypassed — investigate that.
- **Interaction code** — for new pointer features prefer Pointer Events + `setPointerCapture`, delegated listeners on `windowElement`, affordance DOM created on demand, and `:scope >` child queries. (Some existing files use the older `document`+`mouse*` style; match the surrounding style when editing them.)

## Dev pages (`dev/`)

Full detail + rationale in [`docs/context/conventions.md` §Dev pages](docs/context/conventions.md#dev-pages-dev).

- Treat `dev/` as test scaffolding for manually exercising features/bugs, not shippable library source.
- Put interactive testing items (buttons, inputs, forms, selects, etc.) in the `.html` file, not the `.js`. The paired `.js` queries them with `document.querySelector(...)` and wires up behavior with `addEventListener`.
- Pages are auto-discovered — adding a `.html` under `dev/{frame,window,misc}/` is enough, there's no list to update. `_`-prefixed pages are utility pages, skipped when picking the default.
