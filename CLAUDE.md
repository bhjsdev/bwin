# CLAUDE.md

## Git rules

- **Never `git commit` or `git push` unless explicitly asked in that same message.** Approval doesn't carry over — ask each time.

## Testing

- Don't run tests or build after completing a feature or fixing a bug unless asked.

## Naming conventions

- Variables holding a DOM element get an `El` suffix, and keep the noun specific rather than generic — `activeGlassEl`, not `activeEl`. Accessor methods that return an element are named `get<Noun>` to match (e.g. `getActiveGlass`).

## Comments

- Only comment when it adds something the code doesn't already say.
- Keep comments under 2 lines (each line max 100 chars). If a comment genuinely needs to be longer, prefix it with `RATIONAL:`.

## Dev feature examples (`dev/features/`)

- Put interactive testing items (buttons, inputs, forms, selects, etc.) into the `.html` file, not the `.js` file. The paired `.js` queries them with `document.querySelector(...)` and wires up behavior with `addEventListener`. See `add-remove-pane.html` / `add-remove-pane.js` for the pattern.
