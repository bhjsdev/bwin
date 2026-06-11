# CLAUDE.md

## Git

- **Don't `git commit` or `git push` unless the same message explicitly asks for it.** Approval doesn't carry over — ask each time.
- When committing, print the commit message in your reply.
- Type commits that only touch `dev/` as plain `chore:` — never `feat:`/`fix:`, no `(dev)` scope. It's test scaffolding, not library source (see [Dev pages](#dev-pages-dev)).

## Testing

- Don't run tests or builds after finishing a feature or fix unless asked.

## Terminology

bwin borrows real window-construction terms — match their meaning in code, comments, and docs:

- **Window** — the whole layout; the root config node. Renders `<bw-window>` and carries window-level props (`width`, `height`, `fitContainer`).
- **Sash** — a node in the binary tree that organizes panes. Identified by a Sash ID (e.g. `AB-123`). A leaf sash renders a pane; a sash with children renders a muntin.
- **Pane** — a leaf sash, rendered as `<bw-pane sash-id="...">`. Holds a single glass.
- **Muntin** — an internal (parent) sash, rendered as `<bw-muntin sash-id="...">`: the draggable vertical/horizontal divider used to resize panes.
- **Glass** / **attached glass** — the glass inside a `bw-pane` (its header + content). Plain "glass" by default; "attached glass" when contrasting with detached.
- **Detached glass** — the same glass component floating free outside any `bw-pane` (the OS-window-like panel from the detach action), appended directly to the window.

## Naming

- Suffix DOM-element variables with `El`, and keep the noun specific: `activeGlassEl`, not `activeEl`. Name element accessors `get<Noun>` to match (e.g. `getActiveGlass`).
- Name constants for the context they apply to, not just the quantity: `MIN_RESIZE_WIDTH`, not `MIN_WIDTH` — so they aren't confused with unrelated values like creation-time defaults.
- Prefer established domain/library terms and match their conventional meaning. Don't pick a name whose well-known meaning differs from what the code does — e.g. jQuery's `unwrap` removes the wrapper in place, so `extractChildNodes` is clearer for moving children into a fragment.

## Comments

- Comment only when it adds something the code doesn't already say.
- Keep comments to 2 lines max, 100 chars per line. If one genuinely needs more, prefix it with `RATIONAL:`.
- Wrap code keywords in backticks — API/method names, variable names, identifiers (e.g. `addPane`, `activeDragGlassEl`).

## Debug sentinel values

- Leave repeating-digit literals like `222` and `333` in default/fallback paths alone — they're intentional debug sentinels, not magic numbers. Don't rename them to constants or replace them. If one surfaces in a lower-level API or the rendered output, a guard upstream was bypassed and a real value leaked — investigate that instead.

## Dev pages (`dev/`)

- Treat `dev/` as test scaffolding for manually exercising features/bugs, not shippable library source.
- Put interactive testing items (buttons, inputs, forms, selects, etc.) in the `.html` file, not the `.js`. The paired `.js` queries them with `document.querySelector(...)` and wires up behavior with `addEventListener`. See `dev/features/add-remove-pane.html` / `add-remove-pane.js` for the pattern.
