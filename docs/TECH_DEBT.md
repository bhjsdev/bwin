# Tech debt

Durable design flaws, known compromises, and structural issues worth tracking — the kind of thing that outlives a single bug. **Bugs and feature requests are tracked on the [GitHub issues page](https://github.com/bhjsdev/bwin/issues), not here.** Some entries below are the _root cause_ behind one or more issues; link them when known.

This complements [`ARCHITECTURE.md`](./ARCHITECTURE.md) (how things work) and [`context/`](./context/) (conventions, downstream contract). When you fix an item, delete it here; when you take on a new compromise knowingly, add it.

| Severity | Meaning                                                                  |
| -------- | ------------------------------------------------------------------------ |
| high     | Causes bugs, blocks a planned feature, or actively misleads contributors |
| medium   | Friction or fragility; will bite during the next related change          |
| low      | Cosmetic / cleanup; safe to defer indefinitely                           |

---

## [high] `sash.store` is not yet a pure one-way seed

- **Where:** `src/sash.js` (the `TECH DEBT` comment on `this.store`), `src/frame/droppable.js`, `src/frame/muntin.js`
- **What:** `store` is _intended_ as a one-way seed — it carries non-core props (`content`, `title`, `actions`, …) from the top-level API into pane/glass construction, then should stop being consulted. Moves like attach/detach/swap are meant to exchange state through the DOM (visible, debuggable), not through `store`. But two keys are still read long after construction:
  - `onDrop` — read at drop time in `droppable.js`
  - `resizable` — read when a pane is split in `muntin.js`
- **Impact:** `store` can't be cleared in `onPaneCreate` without breaking those two paths, so the "seed" invariant is leaky and the lifecycle is harder to reason about. It's also half of the [react-bwin integration contract](./context/react-bwin-integration.md), so the leak propagates downstream.
- **Fix direction:** move `onDrop`/`resizable` onto the DOM (attributes) or closures at build time, then clear `store` after `onPaneCreate`. See [`ARCHITECTURE.md` §6](./ARCHITECTURE.md#6-the-store-bag-non-core-props-sashstore).

---

## [medium] Two coexisting interaction patterns (legacy `mouse*` vs Pointer Events)

- **Where:** `src/frame/resizable.js` and `src/binary-window/glass/drag.js` (legacy) vs `src/binary-window/detached-glass/move.js`/`resize.js` (modern)
- **What:** Muntin resize and attached-glass drag use document-bound `mousedown`/`mousemove`/`mouseup`. Detached-glass move/resize use the preferred pattern: Pointer Events + `setPointerCapture`, delegated listeners on `windowElement`, affordance DOM created on demand.
- **Impact:** Two mental models for the same kind of feature. The legacy path is mouse-only (no clean touch/pen), can lose the pointer mid-drag, and binds document-global listeners. New contributors must know which file follows which convention.
- **Fix direction:** migrate `resizable.js` and `glass/drag.js` to the modern pattern documented in [`context/conventions.md`](./context/conventions.md#interaction-code-drag--resize--pointer-features). Note `glass/drag.js` also relies on the **native HTML DnD** API specifically (for cross-pane drop), so that migration is more involved than resize.

---

## [medium] `assemble`d modules flatten their whole surface onto the instance — no public/internal split

- **Where:** `Frame.assemble` / `BinaryWindow.assemble` (`src/frame/frame.js:60`, called at `frame.js:67` and `src/binary-window/binary-window.js:168`); the `*Module` mixins (`src/frame/{main,muntin,pane,fit-container,droppable,resizable}.js`, `src/binary-window/{glass,detached-glass,trim}.js`); `strictAssign` (`src/utils.js:173`).
- **What:** A `*Module` is a plain object literal — a bag of methods (e.g. `trim.js` exports `{ trimMuntin, onMuntinCreate, onMuntinUpdate }`). `assemble(...modules)` copies **every** own key of each module onto the class _prototype_ via `strictAssign` (which only guards against collisions, not visibility). So every method a module defines — feature wiring (`enableGlassDrag`), lifecycle hooks (`onMuntinCreate`), and internal helpers (`trimMuntin`) alike — becomes an undifferentiated public method on the `BinaryWindow`/`Frame` instance. There is no marker for "this is internal" vs "this is API".
- **Impact:** The instance's public surface is whatever the modules happen to add, not a curated contract. Hard to tell what consumers may rely on, so any method rename/removal is potentially breaking; this is part of why [`react-bwin` reaches into internals](#medium-react-bwin-depends-on-bwin-internals-no-stable-public-surface) — there's no smaller surface to depend on. Mixing onto the prototype also means no per-module privacy and easy accidental name clashes across modules.
- **Fix direction:** split each module's surface in two — keep `export default` as the bag of methods `assemble` mixes onto the prototype (the genuinely public/overridable instance API + lifecycle hooks), and move the feature-wiring entry points to **named exports that take the instance explicitly** instead of relying on `this`. So `this.enableXxxFeatures()` becomes `xxxModule.enableXxxFeatures(this)`, called from `enableFeatures()`, while `BinaryWindow.assemble(xxxModule, …)` still mixes in the default bag. The named `enableXxx(instance)` functions (and any helpers they call) live off the prototype, so feature wiring is no longer an undifferentiated public method — only the curated default-export surface is. Pairs with formalizing the public surface in the react-bwin entry below.

---

## [medium] Drop infrastructure lives in `frame/` but is really a `binary-window` concern

- **Where:** `src/frame/droppable.js` (`TODO` at top of file)
- **What:** `droppable.js` provides the generic drop scaffolding (`dragover`/`dragleave`/`drop`, `onPaneDrop` stub) in the **Frame layer**, but the only real consumer is the attached-glass drag in the **BinaryWindow layer**, which overrides `onPaneDrop`. The Frame layer has no drop behavior of its own.
- **Impact:** A feature that only makes sense with glasses sits in the layer that doesn't know about glasses — blurring the [Frame/BinaryWindow split](./ARCHITECTURE.md#2-the-big-picture-model--two-view-layers).
- **Fix direction:** consider moving the drop infra into `binary-window/`, next to `glass/drag.js`.

---

## [medium] `react-bwin` depends on bwin internals (no stable public surface)

- **Where:** cross-repo — `../react-bwin`; documented in [`context/react-bwin-integration.md`](./context/react-bwin-integration.md)
- **What:** The React wrapper bypasses `mount()`, walks the sash tree, mutates `sash.domNode`, reads `sash.store.*`, re-implements the actions `undefined`-vs-`null` logic, and duplicates muntin geometry (`MUNTIN_SIZE = 4`) — because bwin exposes no "bring-your-own-DOM" mode, no traversal/layout API, and no content-slot hook.
- **Impact:** Renaming or reshaping internals silently breaks react-bwin; duplicated logic (actions defaults, muntin math) must be hand-synced and drifts.
- **Fix direction:** formalize the integration points into public API (hydrate mode, layout descriptor, content-container accessor). See the per-point fix suggestions in the integration doc.

---

## [low] Source is untyped JavaScript — no static type checking

- **Where:** whole `src/` tree; no `tsconfig.json`, no JSDoc `@type` annotations, no `checkJs`. The shapes that matter most are untyped: `sash.store` keys, the config→sash compile output, the actions `undefined`-vs-`null` contract, and the public API surface.
- **What:** The library is authored in plain `.js` with no compiler in the loop. Data shapes are documented only in prose ([`ARCHITECTURE.md`](./ARCHITECTURE.md), [`context/`](./context/)) and enforced at runtime, never statically. This is distinct from the _output_ gap below (_bwin publishes no TypeScript types_): that one is about shipping `.d.ts` to consumers; this is about checking bwin's own source.
- **Impact:** No compiler catches shape mismatches during refactors — e.g. the queued `bw-pot`/`.bw-action` rework and the in-flight drag-and-drop rework rely entirely on manual tracing plus tests. Type drift against the downstream `react-bwin` shim isn't caught mechanically (same root friction as _`react-bwin` depends on bwin internals_ above). Contributors (and AI assistants reading statically) must trace the pipeline to learn shapes a type would state outright.
- **Fix direction:** prefer an _incremental_ path over a big-bang `.ts` conversion. Add a `tsconfig.json` with `allowJs`/`checkJs` plus JSDoc `@type` annotations, starting with the public API and the `store`/`config`/`sash` shapes — exactly where refactor-safety and the react-bwin contract concentrate. Keeps `.js` source and the current build, and is reversible. A `checkJs` setup that also emits `.d.ts` would subsume the next entry, addressing both gaps at once. Full `.ts` conversion is a larger, separate step to weigh only if the JSDoc path proves its worth (custom-element / DOM typing is the main friction).

---

## [low] bwin publishes no TypeScript types

- **Where:** `package.json` (no `types` field); downstream `react-bwin` ships a hand-written `src/bwin.d.ts` shim
- **What:** No `.d.ts` is generated or shipped, so every TS consumer hand-maintains a `declare module 'bwin'` shim.
- **Impact:** Downstream type drift; no editor intellisense for library consumers.
- **Fix direction:** generate and ship `.d.ts` (add a `types` export); removes the downstream shim. The incremental `checkJs` + JSDoc setup in the entry above can emit these `.d.ts` directly rather than hand-authoring them.

---

## [low] Deprecated `BUILTIN_ACTIONS` export still present

- **Where:** `src/index.js`, `src/binary-window/glass/index.js` (`@deprecated` comments)
- **What:** `BUILTIN_ACTIONS` is kept as a backwards-compat alias. Its value also _differs_ from the current default (`DEFAULT_GLASS_ACTIONS`) — the old aggregate included `maximize`.
- **Impact:** Two names for "the default actions" with subtly different contents; a foot-gun for anyone who picks the deprecated one.
- **Fix direction:** remove on the next major version once downstreams (incl. react-bwin) have migrated to `DEFAULT_GLASS_ACTIONS`.

---

## [low] `bw-pot` is still a bare button, not the autonomous wrapper element

- **Where:** `src/binary-window/glass/action.minimize.js`, `detached-glass/action.minimize.js` (create the pot); `binary-window/sill.js` (`enableSillFeatures`, `enableUnpotGlass`, `enableUnpotDetachedGlass`, `unpotGlass`, `getPotElementBySashId`); `binary-window.js` (`removePane` cleanup); `.bw-pot` in `src/css/sill.css`; `--bw-pot-highlight-color` in `src/css/{vars,theme}.css`.
- **Done:** the state-named `bw-minimized-glass`/`bw-minimized-detached-glass` were renamed to a sill object — a single `<button class="bw-pot" bw-plant="glass|detached-glass">`, giving the verb pair _pot_ (minimize) / _un-pot_ (restore). This was a breaking rename against the [react-bwin integration contract](./context/react-bwin-integration.md) (the old `.bw-minimized-glass` class + `getMinimizedGlassElementBySashId` accessor); landed as a clean rename with no alias, so react-bwin must migrate in lockstep.
- **Remaining:** the pot is still a **bare `<button>`**, which boxes in the roadmap below.
- **Element shape (decided):** make `<bw-pot>` an **autonomous custom element that wraps a real `<button>`**, not a bare button and not a `<button is="bw-pot">` customized built-in:

  ```html
  <bw-pot>
    <button class="bw-pot__restore" aria-label="Restore <glass title>"><!-- snapshot --></button>
    <!-- future: tooltip, badge, … as siblings -->
  </bw-pot>
  ```

  - The **host** owns layout + state — the expandos stashed on minimize (`bwOriginalBoundingRect`, `bwOriginalPosition`, `bwOriginalSashId`, `bwGlassElement`) and the sill-item sizing — and is the positioning context for sibling affordances (tooltip, badge).
  - The inner **`<button>`** is the single activation surface, so click / focus / Enter+Space / `disabled` / `:hover`/`:focus-visible`/`:active` come from the platform — no `role=button`, no hand-written keyboard activation (the custom-button a11y trap). Just needs `aria-label` since its visible content is a snapshot, not text.
  - **Light-DOM only — no Shadow DOM**: theming is plain `bwin.css` classes keyed off `theme="…"`, and downstream react-bwin reads these classes; a shadow root would hide both. Avoids the Safari `is=` polyfill too (customized built-ins are unsupported in WebKit).
  - The sill's delegated click handler changes from `event.target.matches('.bw-pot[bw-plant="…"]')` to `event.target.closest('bw-pot')` so a click on the snapshot still resolves to the pot.

- **Roadmap (why the wrapper):** pots will grow richer — a **live preview** of the stashed glass (CSS-`transform: scale` clone of the kept-alive `bwGlassElement`, `pointer-events:none`, `aria-hidden`; clone, don't move, since restore re-appends the original — `<canvas>`/`<video>` content won't clone pixels and needs a real snapshot fallback) and a **tooltip**. Holding siblings is exactly what the autonomous host enables and a bare/`is=` button cannot.
- **Apply the same shape to `.bw-action`:** the action buttons (`createActions()` in `glass/glass.js`, currently `createDomNode('<button class="bw-action ...">')`) get the **same host-wraps-button** treatment for consistency and for the same roadmap reason (per-action tooltips as siblings). Host carries the `--close/--minimize/--maximize/--detach` modifier + `onClick` wiring + the `updateDisabledState` disabled-sync; inner `<button>` is the activation surface. Keep the existing modifier classes so `updateDisabledStateOfActionButtons` selectors and the react-bwin contract keep working.

---

## [low] Unresolved design questions left as `@think-about` / `@todo`

Open questions parked in code comments — not yet decided:

- **`src/sash.js`** — what should happen when `minWidth`/`minHeight` is set larger than the sash's own width/height? (currently undefined behavior)
- **`src/frame/frame.js`** — should the frame resize immediately when `fitContainer` toggles? (a `fit()` method now exists, so this is partly addressed)

**Impact:** edge-case behavior is unspecified. **Fix direction:** decide the min-vs-own-size rule.
