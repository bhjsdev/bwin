# CLAUDE.md

## Git rules

- **Never `git commit` or `git push` unless explicitly asked in that same message.** Approval doesn't carry over — ask each time.

## Testing

- Don't run tests or build after completing a feature or fixing a bug unless asked.

## Dev feature examples (`dev/features/`)

- Put interactive testing items (buttons, inputs, forms, selects, etc.) into the `.html` file, not the `.js` file. The paired `.js` queries them with `document.querySelector(...)` and wires up behavior with `addEventListener`. See `add-remove-pane.html` / `add-remove-pane.js` for the pattern.
