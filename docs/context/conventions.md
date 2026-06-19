# Coding conventions

The full rationale behind the rules summarized in [`CLAUDE.md`](../../CLAUDE.md). Read this when writing or reviewing bwin source; `CLAUDE.md` is the quick checklist, this is the _why_.

See also [`ARCHITECTURE.md`](../ARCHITECTURE.md) for the system design and [`react-bwin-integration.md`](./react-bwin-integration.md) for the downstream contract.

---

## Terminology

Use the window-construction metaphor precisely — the full glossary is [`ARCHITECTURE.md` §1](../ARCHITECTURE.md#1-the-window-construction-metaphor). Don't pick a name whose well-known meaning differs from what the code does (e.g. jQuery's `unwrap` removes the wrapper in place, so `extractChildNodes` is clearer for moving children into a fragment).

Use plain "glass" by default; say "attached glass" only when contrasting with "detached glass". A **windowless glass** is a detached glass with no owning window (floats on `document.body`); use that exact term — not "free glass" (the old name) or "floating glass".

---

## Naming

- **DOM-element variables get an `El` suffix with a _specific_ noun** — `activeGlassEl`, not `activeEl`, and not a vague `glassEl` when more specificity is available.
- **Element accessors are named `get<Noun>`** — e.g. `getActiveDetachedGlass` (returns the element that `activeGlassEl` would hold).
- **Constants name the context they apply to, not just the quantity** — `MIN_RESIZE_WIDTH`, not `MIN_WIDTH`, so a resize-time minimum isn't confused with an unrelated creation-time size default.
- **Prefer established domain/library terms** and match their conventional meaning.
- **Stash data on DOM elements via a `bw`-prefixed expando property**, not `dataset`/`data-*` attributes — `el.bwOriginalPosition`, `el.bwActionType`. Use this to hand data between elements that outlives a single call (e.g. a detached glass remembering where to re-attach, or a button carrying its action `type` so `transferGlass` can tell custom actions from builtins). The `bw` prefix namespaces it against other libraries and keeps it out of the serialized DOM; reserve `data-*` for values CSS or external tooling must read.
- **Custom HTML _attributes_ are `bw-`-prefixed only on native elements** — a meaningful attribute set on a native element gets `bw-` so it's namespaced and clearly ours: `<button class="bw-pot" bw-plant="glass">`. Do **not** prefix attributes on bwin's own custom elements (`<bw-pane>`, `<bw-glass>`, …); the element name already carries the `bw-` namespace, so plain attributes like `position`, `sash-id`, `maximized`, `detached` stay unprefixed.

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

## Animations (enter / exit)

- **Enter animations are plain CSS** — an `animation:` on the element's base selector fires once when it's inserted (or un-hidden). No JS needed. Example: `bw-glass[detached] { animation: bw-detached-glass-open 0.18s ease-out; }`.
- **Exit animations need a JS dance** — CSS can't animate a _normal_ element out of the DOM (only popover/dialog get `transition-behavior: allow-discrete`). The pattern: set a **`[closing]` attribute** the CSS keys the exit animation off, then **defer `.remove()` with a `setTimeout` matching the CSS duration**. Hold the duration in a named constant next to the helper and keep it in sync with the stylesheet by hand.

  ```js
  export const DETACHED_GLASS_CLOSE_DURATION = 180; // keep in sync with the 0.18s in CSS
  export function removeDetachedGlassElement(el, timeout = DETACHED_GLASS_CLOSE_DURATION) {
    el.setAttribute('closing', '');
    setTimeout(() => {
      el.remove();
      removeGlassBackdrop(el.id);
    }, timeout);
  }
  ```

  Canonical use: `binary-window/detached-glass/utils.js`. Add `pointer-events: none` to the `[closing]` rule so the dying element can't be re-clicked mid-animation.

- **Prefer the timeout over `animationend`** for exit removal — `animationend` bubbles from descendants (a child popover/menu animating), so it needs `event.target`/`animationName` guards plus listener cleanup; the flat timeout is simpler and its constant doubles as documentation.
- **For genuinely discrete elements (popover/dialog), use the platform** instead of the `[closing]` dance — `@starting-style` for the enter state and `transition-behavior: allow-discrete` on `display`/`overlay` for the exit. Example: the `bw-action-menu` popover in `glass.action.css`.
- **Animate only `transform`/`opacity`** for enter/exit so the animation never fights features that set `top`/`left`/`width`/`height` (drag/resize write those directly).

**Why:** keep the simple case simple (CSS-only enter), and make the unavoidable JS for exit a single predictable shape rather than ad-hoc per feature.

---

## Dev pages (`dev/`)

`dev/` is **test scaffolding** for manually exercising features and bugs — not shippable library source.

- **Interactive testing items (buttons, inputs, forms, selects, etc.) go in the `.html` file**, not the `.js`. The paired `.js` queries them with `document.querySelector(...)` and wires behavior with `addEventListener`. Canonical example: `dev/features/add-remove-pane.html` / `add-remove-pane.js`.
- **Commits that only touch `dev/` are plain `chore:`** — never `feat:`/`fix:`, no `(dev)` scope. It's scaffolding, not library source.
