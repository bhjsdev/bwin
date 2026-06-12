# Coding conventions

The full rationale behind the rules summarized in [`CLAUDE.md`](../../CLAUDE.md). Read this when writing or reviewing bwin source; `CLAUDE.md` is the quick checklist, this is the *why*.

See also [`ARCHITECTURE.md`](../ARCHITECTURE.md) for the system design and [`react-bwin-integration.md`](./react-bwin-integration.md) for the downstream contract.

---

## Terminology

Use the window-construction metaphor precisely — the full glossary is [`ARCHITECTURE.md` §1](../ARCHITECTURE.md#1-the-window-construction-metaphor). Don't pick a name whose well-known meaning differs from what the code does (e.g. jQuery's `unwrap` removes the wrapper in place, so `extractChildNodes` is clearer for moving children into a fragment).

Use plain "glass" by default; say "attached glass" only when contrasting with "detached glass".

---

## Naming

- **DOM-element variables get an `El` suffix with a *specific* noun** — `activeGlassEl`, not `activeEl`, and not a vague `glassEl` when more specificity is available.
- **Element accessors are named `get<Noun>`** — e.g. `getActiveGlass` (returns the element that `activeGlassEl` would hold).
- **Constants name the context they apply to, not just the quantity** — `MIN_RESIZE_WIDTH`, not `MIN_WIDTH`, so a resize-time minimum isn't confused with an unrelated creation-time size default.
- **Prefer established domain/library terms** and match their conventional meaning.

**Why:** self-documenting names. A reader should know what a variable holds and where a constant applies without chasing its definition.

---

## Comments

- **Comment only when it adds something the code doesn't already say.** No restating the obvious.
- **Keep comments terse: ≤2 lines, ≤100 chars per line.** If one genuinely must run longer, prefix it with `RATIONAL:` so the length is clearly deliberate.
- **Wrap code keywords in backticks** — API/method names, variable names, identifiers (e.g. `` `addPane` ``, `` `activeDragGlassEl` ``).

**Why:** terse, high-signal comments. Long unexplained comment blocks read as noise; the `RATIONAL:` prefix marks the rare case where the prose really is load-bearing.

---

## Debug sentinel values

Repeating-digit literals like `222` and `333` in default/fallback paths are **intentional debug sentinels, not magic numbers**. They mark a guard that should have supplied a real value.

- **Don't rename them to constants or "tidy" them away.**
- The real default is applied upstream by a guard; the sentinel sits in the constructor/fallback as a tripwire. Example: `addDetachedGlass` applies the real default size (`200`), while `DetachedGlass`'s constructor falls back to `222`. A `222`-sized glass on screen means something constructed `DetachedGlass` directly, **bypassing the guard** — that's the bug to chase, not the literal.
- Likewise `ConfigRoot` defaults `width/height` to `333`; seeing `333` downstream means a real dimension never reached it.

**Why:** they look like magic numbers but are diagnostic markers. If one surfaces in a lower-level API or the rendered output, investigate the bypassed guard — don't replace the sentinel.

---

## Interaction code (drag / resize / pointer features)

Preferred patterns for **new** pointer-driven interaction features:

- **Pointer Events + `setPointerCapture`** over the older `document`-bound `mousemove`/`mouseup` pattern. One code path covers mouse/touch/pen, capture keeps move events flowing when the pointer leaves the target, and capture self-releases.
- **Delegated listeners on `windowElement`**, not per-element — keeps the listener count constant regardless of how many glasses/panes exist.
- **Create interaction DOM (e.g. resize handles) on demand** — on hover via `pointerover`/`pointerout`, not eagerly in a constructor — so idle elements cost zero extra nodes.
- **Scope child queries with `:scope > selector`** so handles/affordances aren't confused with arbitrary user content nested in `bw-glass-content`.

**Why:** correctness (not losing the pointer mid-drag) and performance (listener count, node count when many elements exist) are weighed deliberately.

**Note — existing code diverges:** `frame/resizable.js` and the attached-glass `binary-window/glass/drag.js` still use the older `document` + `mouse*` style. The detached-glass `move.js`/`resize.js` use the modern Pointer Events pattern. Follow the modern pattern for new features; match the surrounding style when editing existing files.

---

## Dev pages (`dev/`)

`dev/` is **test scaffolding** for manually exercising features and bugs — not shippable library source.

- **Interactive testing items (buttons, inputs, forms, selects, etc.) go in the `.html` file**, not the `.js`. The paired `.js` queries them with `document.querySelector(...)` and wires behavior with `addEventListener`. Canonical example: `dev/features/add-remove-pane.html` / `add-remove-pane.js`.
- **Commits that only touch `dev/` are plain `chore:`** — never `feat:`/`fix:`, no `(dev)` scope. It's scaffolding, not library source.
