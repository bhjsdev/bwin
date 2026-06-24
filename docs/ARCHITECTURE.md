# bwin — Software Architecture

**bwin** ("Binary Window") is a lightweight, dependency-free tiling window-manager library for the browser: resizable panes, drag-and-drop rearrangement, minimize/maximize/close, and floating OS-window-like panels.

> This document describes the internal architecture for contributors. For the public API/config reference, see the [docs site](https://bhjsdev.github.io/bwin-docs/).

---

## 1. The window-construction metaphor

bwin borrows real window-construction vocabulary. Matching it in code, comments, and docs is a hard project convention:

| Term                           | Meaning                                                                                                                                      | Renders as                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Window**                     | The whole layout; the root config node. Carries window-level props (`width`, `height`, `fitContainer`, `theme`).                             | `<bw-window>`                                         |
| **Sash**                       | A node in the binary tree that organizes panes. Identified by a **Sash ID** (e.g. `AB-123`).                                                 | — (model only)                                        |
| **Pane**                       | A _leaf_ sash. Holds a single glass.                                                                                                         | `<bw-pane sash-id="…">`                               |
| **Muntin**                     | An _internal_ (parent) sash: the draggable divider used to resize the two children.                                                          | `<bw-muntin sash-id="…">`                             |
| **Glass** / **attached glass** | The content inside a pane: header (title/tabs + action buttons) + content.                                                                   | `<bw-glass>` inside a `<bw-pane>`                     |
| **Detached glass**             | The same glass component floating free outside any pane (the OS-window-like panel produced by the detach action).                            | `<bw-glass detached>` appended to `<bw-window>`       |
| **Windowless glass**           | A detached glass with _no owning window_ — it floats on `document.body` instead of inside a `<bw-window>`. Created via `addWindowlessGlass`. | `<bw-glass detached windowless>` appended to `<body>` |
| **Sill**                       | The dock at the bottom of the window holding minimized glasses.                                                                              | `<bw-sill>`                                           |

---

## 2. The big picture: model + two view layers

bwin separates a **model** from **two stacked view layers**. The model is the single source of truth for geometry; each view layer renders the model to DOM and wires its own interactions. `BinaryWindow extends Frame`, so the layers stack rather than sit side by side.

```
      Config             Sash tree              Frame             BinaryWindow
                          (model)           (core tiling)          (enhance)
 ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 │ ConfigRoot   │     │ Sash tree    │     │ bw-window    │     │ bw-glass     │
 │ ConfigNode   │ ──> │ root Sash    │ ──> │ bw-muntin    │ ──> │ drag         │
 │ buildSash-   │     │ + children   │     │ bw-pane      │     │ drop         │
 │   Tree()     │     │              │     │ resize       │     │ detached     │
 │              │     │              │     │ fit          │     │ sill         │
 └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                              ▲                                         │
                              └─────────────────────────────────────────┘

  ──>  config compiles to the sash tree; the two view layers render it to DOM.
  Example flow: drag a muntin ─> update the sash tree ─> re-create the layout
  (update()). Every interaction follows this shape: mutate the tree, re-render.
```

**Model — `Sash`** (`src/sash.js`)
The single source of truth for geometry; nothing else owns layout state.

- A binary tree of regions. Each node holds `left/top/width/height`, `minWidth/minHeight`, `resizeStrategy`, and a `store` bag.
- Setters cascade geometry down to children, so the tree stays consistent after any change.

**Frame layer — core tiling** (`src/frame/`)
The view layer that _mirrors the model_. Renders the structure, owns resizing.

- Renders the window, **muntins**, and **panes**.
- Owns **pane resizing**: dragging a muntin mutates the sash tree — the defining feature of a tiling manager. Also handles generic drop infrastructure and fit-to-container.
- Renders panes but **not** their contents — a `<bw-pane>` is an empty region until the layer above fills it.

**BinaryWindow layer — enhanced interaction** (`src/binary-window/`)
`extends Frame` and adds the user-facing window experience on top.

- Renders a **glass** into each pane (`onPaneCreate`) — this layer is where "windows" (glasses) live; the Frame layer underneath only knows panes.
- Adds glass drag-and-drop rearrangement, the minimize/maximize/close/detach actions, **detached** (floating) glasses, and the **sill**.

Rendering is one-directional in both layers: sash tree → DOM, via `glaze()` (initial render) and `update()` (incremental reconcile). An interaction in either layer mutates the sash tree and calls `update()`; the DOM follows. Features are mixed onto each class's prototype via `assemble()` and attached to the live DOM in `enableFeatures()`.

### The `mount()` lifecycle

`Frame.mount(containerEl)` is the normal entry point and runs two phases:

1. **`frame(containerEl)`** — _DOM creation._ Creates `<bw-window>`, calls `glaze()` to render the whole sash tree, appends to the container. `BinaryWindow.frame()` additionally appends `<bw-sill>`.
2. **`enableFeatures()`** — _interaction wiring._ Attaches event listeners for resize/drop/fit; `BinaryWindow` adds glass and detached-glass features.

This split is deliberate and is itself an integration seam — `react-bwin` skips `mount()`, sets `windowElement`/`containerElement`/`sillElement` from its own React-created DOM, then calls `enableFeatures()` directly (see §9).

---

## 3. The `assemble()` mixin pattern

bwin avoids deep class hierarchies for features. Instead, `Frame`/`BinaryWindow` are assembled from **module objects** — plain objects whose keys become prototype methods:

```js
// src/frame/frame.js
Frame.assemble(
  mainModule,
  muntinModule,
  paneModule,
  fitContainerModule,
  droppableModule,
  resizableModule
);

// src/binary-window/binary-window.js
BinaryWindow.assemble(glassModule, detachedGlassModule, trimModule, sillModule);
```

`assemble()` uses `strictAssign` (`src/utils.js`), which **throws if a key already exists** on the target prototype. This makes the method namespace a flat, collision-checked shared space.

**Consequence — namespace your mixin methods.** Because all module methods share one namespace, a new feature must not reuse an existing method name. `frame/resizable.js` already owns `enableResize`, so the detached-glass resize feature is `enableDetachedGlassResize`, _not_ `enableResize`. When adding a feature, prefix its methods with the feature name.

**Override via composition.** Modules later in the `assemble()` list can't silently clobber (strictAssign throws), so genuine overrides happen through subclassing: `BinaryWindow.onPaneCreate` overrides `Frame`'s, `binary-window/glass/drag.js`'s `onPaneDrop` overrides the empty stub in `frame/droppable.js`, and `trimModule.onMuntinCreate` wraps muntin creation. The base modules leave `onPaneCreate`/`onPaneDrop`/`onMuntinCreate` as empty "intended to be overridden" hooks.

---

## 4. Configuration → Sash tree (`src/config/`)

The public API constructs a window declaratively and bwin compiles it into a sash tree.

```js
new BinaryWindow({ width, height, fitContainer, theme, children: [...] }).mount(containerEl);
```

### Config node forms

Each child config node may be written three ways (`ConfigNode.normConfig`):

- **Object** — `{ position, size, content, children, ... }` (full form).
- **Array** — shorthand for `{ children: [...] }` (a split with no other props).
- **String/number** — shorthand for `{ size }` (e.g. `"60%"`, `0.4`, `300`).

Node props:

- **Structural** (named by the config layer): `position` (`left|right|top|bottom`), `size` (px number, fraction `0.4`, or `"60%"`), `id`, `minWidth`, `minHeight`, `children`, `resizeStrategy`.
- **Everything else** → `...rest` → `nonCoreData` (see §6).

A node with **no children** becomes a **pane**; a node **with children** becomes a **split** (rendered as a muntin + its two subtrees). Maximum **two children** per node — an omitted second child has its position/size _inferred_ from the first (opposite position, complementary size).

### Build flow

```
ConfigRoot(settings)                       config-root.js
  extends ConfigNode                       config-node.js
  └ buildSashTree({ resizeStrategy })
      ├ createSash()                  ─────────────> new Sash(...)   (store = nonCoreData)
      ├ normConfig(children[0]) ──> createPrimaryConfigNode
      ├ normConfig(children[1]) ──> createSecondaryConfigNode(…, primary)
      │     (infers opposite position / complementary size from the sibling)
      └ recurse into each child's buildSashTree()
```

- **`ConfigNode`** does geometry math up front: `getPosition`, `getSize`, and `setBounds` compute absolute `left/top/width/height` from the parent rect and the position/size. Sibling inference and validation live in `getPosition`/`getSize` (e.g. "sum of sibling sizes must equal 1 / parent dimension").
- **`ConfigRoot`** is the entry; defaults `width/height` to the `333` debug sentinel (if it surfaces downstream, a real dimension failed to reach it). It strips `fitContainer`/`theme` as feature flags and forwards the rest.
- **`SashConfig`** (`config/sash-config.js`) is an alternate entry: a pre-built `Sash` subtree can be passed directly to `Frame`/`BinaryWindow` instead of a config object — `Frame`'s constructor branches on `settings instanceof SashConfig`.

### `parseSize` (`src/utils.js`)

Normalizes sizes: `"50%"` → `0.5` (fraction < 1), `"100px"` / `100` → `100` (absolute px). Fractions and absolutes are handled distinctly throughout the geometry code.

---

## 5. The Sash model (`src/sash.js`)

The heart of the layout engine. A `Sash` is a binary-tree node; it never touches the DOM (except holding a `domNode` reference set by the view).

### Tree shape & queries

- `children` is `[]` (leaf/pane) or exactly two nodes (split). `isLeaf()` / `isSplit()`.
- Positional accessors: `leftChild`/`rightChild`/`topChild`/`bottomChild`, plus `getChildren()` → `[top, right, bottom, left]`.
- A split is either **left/right** (`isLeftRightSplit`) or **top/bottom** (`isTopBottomSplit`).
- Lookups: `getById`, `getAllIds`, `getDescendantParentById`, `getChildSiblingById`, `getAllLeafDescendants`, `getLargestLeaf`.
- `walk(cb)` — **post-order** (deepest child first), used by the view to render/reconcile.
- `swapIds(id1, id2)` — exchanges two sashes' IDs in place (used by the center-drop swap).

### Geometry & cascading setters

`top`/`left`/`width`/`height` are getter/setter pairs over private `_`-fields. **Setting a dimension cascades to children** so the subtree stays consistent:

- Setting `width` on a left/right split distributes the delta between `leftChild` and `rightChild` (proportionally by default), enforcing each side's `calcMinWidth()`; setting it on a top/bottom split widens both children equally.
- `height` is symmetric for top/bottom vs left/right.
- `top`/`left` shift both children by the same delta.

### Min-size propagation

`calcMinWidth()` / `calcMinHeight()` recurse: a left/right split's min width is the **sum** of children's min widths (they share the axis), while its min height is the **max**; top/bottom splits are the mirror. This is what stops a resize from crushing a deeply-nested pane below its minimum. Initial leaf minimums come from `VITE_DEFAULT_SASH_MIN_WIDTH/HEIGHT`.

### Resize strategies

`resizeStrategy` is `'classic'` (default) or `'natural'`:

- **classic** — both children share the delta proportionally.
- **natural** — only one child changes size; the other holds, depending on which side the divider belongs to.

---

## 6. The `store` bag: non-core props (`sash.store`)

Structural props are named explicitly in the config layer; **everything else is opaque pass-through** carried in `sash.store`. This is how `content`, `title`, `tabs`, `actions`, `draggable`, `droppable`, `resizable`, and event handlers (`onDrop`) travel from declarative config to pane/glass construction.

### The path (declarative config)

1. `config-node.js` — constructor destructures only structural keys; the `...rest` becomes `this.nonCoreData`. (Threaded through `createPrimary/SecondaryConfigNode` so it survives recursion.)
2. `createSash()` passes `nonCoreData` as the Sash's `store`.
3. `sash.js` — `this.store = store`; the Sash **never inspects it**.
4. `binary-window.js` `onPaneCreate` — `new Glass({ actions, ...sash.store, sash, binaryWindow: this })` re-surfaces store keys as top-level Glass options.
5. `glass.js` — the `Glass` constructor names them (`title`, `content`, `tabs`, `actions`, `draggable`) with defaults.

### `store` is a one-way seed (by intent)

`store` carries data from the top-level API into construction, then **should stop**. It is _not_ a live model — moves like attach/detach/swap exchange data through the **DOM**, not through `store`, because the DOM is visible and debuggable in the browser. (See the `RATIONAL:` block in `sash.js`.)

**Known tech debt:** `store` is not yet a pure seed. Two keys are still read long after construction — `onDrop` (read at drop time in `droppable.js`) and `resizable` (read when a pane is split in `muntin.js`). Until those move onto DOM/closures at build time, `store` can't be cleared in `onPaneCreate`.

### Store-key consumer map

`store` has no fixed schema. Recognized keys and where they're read:

| Key                                               | Read by                                      | Effect                                          |
| ------------------------------------------------- | -------------------------------------------- | ----------------------------------------------- |
| `content`                                         | `frame/pane.js` (and re-surfaced to `Glass`) | DOM-node'd and placed in the pane/glass content |
| `droppable === false`                             | `frame/pane.js`                              | sets `can-drop="false"` on the pane             |
| `onDrop` (fn)                                     | `frame/droppable.js`                         | called `onDrop(event, sash)` on drop            |
| `resizable === false`                             | `frame/muntin.js`                            | sets `resizable="false"` on the muntin          |
| `actions` / `title` / `tabs` / `draggable` / rest | `binary-window.js onPaneCreate` → `Glass`    | spread into the `Glass` constructor             |

### The `undefined` vs `null` actions contract (load-bearing)

A default parameter fires **only on `undefined`**. This is relied on by docs and react-bwin:

- User **omits** `actions` → absent from store → `undefined` → `Glass` defaults to `DEFAULT_GLASS_ACTIONS`.
- User writes `actions: null` (or `[]`) → reaches `Glass` as a non-array → `createActions` renders **no** buttons.

### Two other paths to `Glass`

- **Imperative `addPane(id, props)`** destructures `{position, size, id, ...glassProps}` and passes `glassProps` straight to `new Glass` — bypassing ConfigNode/store entirely.
- **`DetachedGlass`** defaults `actions` to `DEFAULT_DETACHED_GLASS_ACTIONS` instead.

---

## 7. The view: rendering & reconciliation (`src/frame/`)

### `glaze()` — initial render (`frame/main.js`)

`rootSash.walk(...)` (post-order) over the whole tree:

- split sash → `createMuntin` + `onMuntinCreate`, **appended** (muntins end up on top in z-order).
- leaf sash → `createPane` + `onPaneCreate`, **prepended**.
- each sash's `domNode` is set to its element.

### `update()` — incremental reconcile (`frame/main.js`)

After any tree mutation (resize, add/remove/swap pane), `update()` reconciles DOM to model:

1. Resize `<bw-window>` to the root sash.
2. Remove DOM elements whose `sash-id` is no longer in `rootSash.getAllIds()`.
3. `walk` the tree: for each sash, **create** its element if new, else **update** position/size in place (`updatePane`/`updateMuntin`) and fire the `on*Update` hooks.

Because Sash IDs are stable across an operation (e.g. `removePane` promotes a sibling's ID into its parent; splits hand the new muntin a fresh `genId`), `update()` can tell apart "moved" from "new/removed".

### Pane geometry (`frame/pane-utils.js`)

`createPaneElement`/`updatePaneElement` write `top/left/width/height` styles and `sash-id`/`position` attributes. `addPaneSash` (+ the four `addPaneSashTo{Left,Right,Top,Bottom}` helpers) performs the **tree surgery** for a split: it converts the target leaf into a split parent (target gets a fresh muntin ID, `domNode = null`), creates the two child sashes (one inherits the target's old ID + `domNode`), and returns the new sash. Sizing honors `size` as fraction or px.

### Muntins (`frame/muntin.js` + `binary-window/trim.js`)

`createMuntin`/`updateMuntin` position a `muntinSize`-px (4px) divider at the boundary between the two children, marked `vertical` (left/right split) or `horizontal` (top/bottom split). `sash.store.resizable === false` sets `resizable="false"`. `trim.js` (a `BinaryWindow` mixin) shrinks each muntin by half its size at both ends via `onMuntinCreate`/`onMuntinUpdate` so dividers don't overlap at intersections.

---

## 8. Interaction features

### 8.1 Resize (`frame/resizable.js`)

Drag a muntin to resize its two children. Uses **document-bound `mousedown`/`mousemove`/`mouseup`** (the older pattern — see §11). On `mousedown` over a `<bw-muntin>` (unless `resizable="false"`), records the active muntin sash; on `mousemove`, applies the delta to the two children (clamped by `calcMinWidth`/`calcMinHeight`) and calls `update()`; on `mouseup`, clears state. A `body--bw-resize-x/y` class sets the cursor during the drag.

### 8.2 Glass drag-and-drop rearrangement (native HTML DnD)

Dragging an attached glass and dropping it on a pane rearranges the layout. Split across three files:

- **`frame/droppable.js`** — generic drop infrastructure on `windowElement`: `dragover` (must `preventDefault` to allow drop; finds the `<bw-pane>` under cursor, computes the zone via `getCursorPosition`, writes it to the pane's `drop-area` attribute so CSS paints a preview), `dragleave` (with a Chrome child-element guard), and `drop` (resolves the sash, calls the overridable `onPaneDrop(event, sash)` stub, then any `sash.store.onDrop`).
- **`binary-window/glass/drag.js`** — arms the attached-glass drag and provides the **real `onPaneDrop`**. A native drag is one document-global gesture, so the dragged element is tracked in a **module-level** `activeDragGlassEl` (only one glass drags at a time). `mousedown` on a `bw-glass-header` (left button, `can-drag` not false) sets `draggable=true` on the glass; `dragstart` saves and disables the source pane's `can-drop` so it isn't its own target; `dragend`/`mouseup` clean up and carry `can-drop` back.
- **`src/position.js`** — `getCursorPosition` splits a pane into 5 zones (top/right/bottom/left/center) using the two diagonals plus a center box (`centerRadio = 0.3`).

**`onPaneDrop` branches on the drop zone:**

- **center** → `swapPanes` (`frame/pane.js`): swap the two sashes' IDs in the tree, swap their DOM child nodes, swap `sash-id`/`can-drop` attributes. No new pane — the two glasses trade places.
- **top/right/bottom/left** → split: `removePane(oldSashId)` (the dragged glass's original pane; its sibling collapses up), then `addPane(targetSash.id, { position: dropArea, id: oldSashId })`, then **move the same glass element** into the new pane via `replaceChildren(activeDragGlassEl)`.

> **Gotcha:** `BinaryWindow.addPane` always seeds a new pane with its own empty placeholder `Glass`. The drop must `replaceChildren` (not `append`) — a plain append would leave **two** glasses (the empty placeholder first), and a later detach's `querySelector('bw-glass-content')` would then grab the empty one → a blank detached glass.

### 8.3 Fit container (`frame/fit-container.js`)

When `fitContainer` is set, a `ResizeObserver` on the container calls `fit()` (inside `requestAnimationFrame`), which sets the root sash to the container's client size and `update()`s. `fit()` is also exposed as a public method.

### 8.4 Glass actions (`binary-window/glass/`)

Each built-in action is a small object `{ label, className, onClick(event, binaryWindow) }`. `Glass.createActions()` renders them as buttons in `<bw-action-bar>` and wires `onClick`. `DEFAULT_GLASS_ACTIONS = [minimize, detach, close]`.

- **close** (`action.close.js`) — removes the pane.
- **minimize** (`action.minimize.js`) — appends a `<button class="bw-pot" bw-plant="glass">` to the sill that stashes the live glass element + original position/rect/sash-id, then `removePane`s. Un-potting re-inserts the glass (the `getPotElementBySashId` path in `binary-window.js removePane` also cleans up pots).
- **maximize** (`action.maximize.js`) — toggles a `maximized` attribute, saving/restoring the pane's bounding rect; maximized panes go `0/0/100%/100%`.
- **detach** (`action.detach.js`) — see §8.5.

Built-in actions are **pane-centric** (`closest('bw-pane')`), so they don't work on detached glasses — which is why detached glass ships its own action set.

### 8.5 Detached glass (`binary-window/detached-glass/`)

Floating `<bw-glass detached>` panels that mimic OS windows, appended directly to `windowElement` (not bound to any pane/sash). The canonical "feature folder," mirrored by `glass/`:

| File                                                          | Role                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.js`                                                    | re-exports `DetachedGlass` + the action defaults; the assembled mixin (`enableDetachedGlassStandaloneFeatures` + `crud` spread). See the split below.                                                                                                                                                                                                                                                                                                     |
| `detached-glass.js`                                           | `DetachedGlass extends Glass`; positions/sizes the floating node, defaults `actions = DEFAULT_DETACHED_GLASS_ACTIONS`.                                                                                                                                                                                                                                                                                                                                    |
| `crud.js`                                                     | `addDetachedGlass` / `removeDetachedGlass` (public). Cascades placement down-right from the active glass; guards size so the constructor's `222` debug default never fires.                                                                                                                                                                                                                                                                               |
| `manager.js`                                                  | `detachedGlassManager` singleton: the shared registry + focus/stacking coordinator for **all** detached glasses (in-window and windowless alike), and the single entry point for their lifecycle — `addDetachedGlass` (build + register + `bringToFront` + open animation), `removeDetachedGlass` (unregister **and** remove the DOM node + backdrop), `updateDetachedGlass` (stub), plus `bringToFront` / `getActiveDetachedGlass`. See the split below. |
| `activate.js`                                                 | click-to-focus → `bringToFront`. Document-global; installed by `enableDetachedGlassStandaloneFeatures`.                                                                                                                                                                                                                                                                                                                                                   |
| `move.js`                                                     | drag the header to reposition (pointer events + `setPointerCapture`). Document-global; installed by `enableDetachedGlassStandaloneFeatures`.                                                                                                                                                                                                                                                                                                              |
| `resize.js`                                                   | 8 resize handles created **on demand** (on hover). Document-global; installed by `enableDetachedGlassStandaloneFeatures`.                                                                                                                                                                                                                                                                                                                                 |
| `action.attach.js` / `action.close.js` / `action.minimize.js` | the detached action set.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `utils.js`                                                    | `genStylesByPosition`, resize-handle creation, `removeGlassBackdrop`, `getContainingBlockOrigin`.                                                                                                                                                                                                                                                                                                                                                         |

`DEFAULT_DETACHED_GLASS_ACTIONS = [minimize, attach, close]`. **minimize** (`action.minimize.js`) stashes the glass on a sill pot (`bwDetachedGlassElement`), then plays a FLIP-style flight — `animateElementToElement` (`src/animate.js`) shrinks/flies the glass onto its pot before deferring `display:none` into the animation's `onDone`.

**Standalone vs. per-instance features.** `activate`/`move`/`resize` attach **document-global, instance-independent** listeners (they find their target via `closest('bw-glass[detached]')` and never read `this`). They're installed by `enableDetachedGlassStandaloneFeatures()`, called **once at module load** in `binary-window.js` (module evaluation is one-time, so no idempotency flag is needed). This is what makes the static `addWindowlessGlass` path work with **no mounted window** — importing `BinaryWindow` is enough to wire move/resize/activate. Un-potting (restore from the sill) is **not** here: it's a per-instance sill feature wired by `enableSillFeatures()` (see `sill.js`), which needs `this.sillElement` (windowless glasses have no sill). _Historical note:_ an earlier `drag.js` offered native-DnD repositioning (docked to panes) as an alternative to `move.js`; it was removed in favor of free-floating `move.js`.

**Manager owns the lifecycle; the caller only owns the DOM `append`.** `detachedGlassManager` is the single point for add/remove/update:

- `addDetachedGlass(options)` — **builds the `DetachedGlass`, registers + `bringToFront`s it, and plays the open animation** (`animateDetachedGlassOpen`, unless `animateOpen: false`). Returns the glass **element** (`glass.domNode`), not the instance. The **only** thing left to the caller is the DOM `append`, because the parent differs (`crud.js` → `windowElement`, `addWindowlessGlass` → `document.body`); the windowless modal backdrop reads the returned element's `style.zIndex` (set by `bringToFront`) and sits at `z − 1`. `crud.js` pre-computes cascade placement + the size guard, then forwards everything as options.
- `removeDetachedGlass(id, { animateClose = true } = {})` — **owns the full teardown.** Splices from the array **and** removes the DOM node + modal backdrop via `removeDetachedGlassElement` (`utils.js`, `[closing]` attr + deferred `.remove()`). The **close** action, `binaryWindow.removeDetachedGlass`, and `removeWindowlessGlass` all route through it.
- `updateDetachedGlass(id, options)` — tentative stub (throws) for a future in-place update path.

`bringToFront` / `getActiveDetachedGlass` stay agnostic about whether a glass lives in a `bw-window` or on `document.body`.

**Position** supports the four corners + `center` (centered via `calc(50% - size/2)`, _not_ translate, so left/top stay in sync with drag/resize math; `offset` has no effect on centered).

**Detach → attach round-trip:**

- **detach** (`glass/action.detach.js`): creates a centered detached glass sized to the window, then **moves the real content/title elements** into it (`replaceWith`), stashes the origin (`bwOriginalSiblingSashId`, `bwOriginalPosition`, `bwOriginalRelativeSize`) on the DOM node, and `removePane`s the source.
- **attach** (`detached-glass/action.attach.js`): reads the stashed origin and rebuilds a pane via `addPane`, moving the inner content nodes back in. If the original sibling is gone, it falls back to splitting the **largest leaf** (right if wide, bottom if tall) at 50%, then `removeDetachedGlass`.

> **Key contrast with the attached-glass split:** detach/attach round-trips data through the **DOM** (extract content nodes, build a fresh `Glass`), whereas the attached-glass drop _moves the same element_.

### 8.6 Windowless glass (`BinaryWindow.addWindowlessGlass`)

A **windowless glass** is a detached glass with no owning window: it's appended to `document.body` instead of a `<bw-window>` and isn't bound to any `BinaryWindow` instance. It's still registered with the shared `detachedGlassManager`, so z-index/activation stacking works the same as for an in-window detached glass. Move/resize/activate work **without any mounted window** because those listeners are document-global and installed at module load (see "Standalone vs. per-instance features" in §8.5).

- **Create** (`binary-window.js` `addWindowlessGlass`) — calls `detachedGlassManager.addDetachedGlass({ position: 'center', ... })`, which builds the `DetachedGlass`, registers + `bringToFront`s it, and plays the open animation; then sets the `windowless` attribute and appends it to `document.body`. **Remove** (`removeWindowlessGlass(id)`) — delegates to `detachedGlassManager.removeDetachedGlass(id)`, which unregisters, removes the node, and tears down its modal backdrop (below).
- **Modal backdrop** — passing `modal: true` appends a `<bw-glass-backdrop for="<glassId>">` to `document.body` that blocks interaction with everything underneath. Its `z-index` is set inline to `glassZIndex - 1` — the odd slot the `topZIndex += 2` reservation (above) leaves free — so it sits directly below its glass. Both `removeWindowlessGlass` and the detached **close** action remove the matching `bw-glass-backdrop[for="…"]` via the shared `removeGlassBackdrop` helper in `detached-glass/utils.js`. Styled in `detached-glass.css` (`position: fixed; inset: 0`), color from `--bw-glass-backdrop-color`.
- **Actions** — with no `binaryWindow`, the _minimize_ and _attach_ actions (which need a window to minimize into / attach to) don't apply, so the default set is **close only**: `DEFAULT_WINDOWLESS_GLASS_ACTIONS = [closeAction]` (vs. `[minimize, attach, close]` for an in-window detached glass).
- **Containing block** (`detached-glass/utils.js` `getContainingBlockOrigin`) — both kinds are `position: absolute`, but their reference frame differs. An in-window detached glass's `offsetParent` is the positioned `bw-window`, so the origin is that window's rect top-left. A windowless glass on a _static_ `body` has no positioned ancestor → its containing block is the **initial** one (document origin), so the origin is `{ left: -scrollX, top: -scrollY }`. Drag (`move.js`) and resize math both route through this so viewport bounding stays correct regardless of scroll.
- **Modal z-index reservation** (`manager.js`) — `bringToFront` increments `topZIndex` by **2** (not 1) and returns the new value, reserving the odd slot just below for a modal overlay on a windowless glass.
- **Theming caveat** — windowless glasses live outside `bw-window`, so theming code must select `bw-glass[windowless]` separately (see `dev/index.js`).

---

## 9. Public API surface (`src/index.js`)

Exports: `Frame`, `BinaryWindow`, `Sash`, `SashConfig`, `ConfigRoot`, `Position`, `DEFAULT_GLASS_ACTIONS`, `DEFAULT_DETACHED_GLASS_ACTIONS`, `DEFAULT_WINDOWLESS_GLASS_ACTIONS`, and the **deprecated** `BUILTIN_ACTIONS` (backwards-compat alias). CSS is imported here (`vars/body/frame/glass/detached-glass/sill`) and shipped as `bwin.css`.

Key methods on `BinaryWindow`:

- `mount(containerEl)` / `frame()` / `enableFeatures()` — lifecycle.
- `addPane(targetSashId, { position, size, id, ...glassProps })` — split a pane and attach a glass.
- `removePane(sashId)` — remove a pane (or clean up a minimized entry).
- `addDetachedGlass(options)` / `removeDetachedGlass(id)` — floating panels inside the window.
- `addWindowlessGlass(options)` / `removeWindowlessGlass(id)` — _static_ floating panels on `document.body`, with no owning window (§8.6).
- `setTheme(theme)` / `fit()`.

**Per-window `actions` config** is normalized by `BinaryWindow.normActions` into `[glassActions, detachedGlassActions]`, supporting forms like `[a1, a2]`, `[[glassActions]]`, `[glassActions, detachedGlassActions]`, `[undefined, detachedGlassActions]`, etc. `undefined` → both defaults; `null`/`[]` → none.

### Downstream coupling — `react-bwin`

The React wrapper (`../react-bwin`) must own DOM creation, so it bypasses `mount()` and reaches into internals. These are signals for public API bwin could formalize:

- Skips `mount()`; sets `windowElement`/`containerElement`/`sillElement` then calls `enableFeatures()` → wants a "bring-your-own-DOM"/hydrate mode.
- Walks the sash tree (`rootSash.walk`, `children`, `leftChild`/`topChild`) and mutates `sash.domNode` from refs → wants a public traversal/serializable-layout API.
- Reads `sash.store.*` (`actions`, `title`, `content`, `droppable`, `draggable`, `resizable`) → **`store` is effectively the integration contract.**
- Re-implements the `undefined`-vs-`null` actions logic inline and imports `BUILTIN_ACTIONS`/`DEFAULT_GLASS_ACTIONS` from bwin → must be kept in sync by hand.
- Recomputes muntin geometry (`MUNTIN_SIZE=4`) → duplicated math.
- Hand-maintains `bwin.d.ts` because **bwin publishes no TypeScript types** → shipping `.d.ts` would remove the shim.

---

## 10. Styling & theming (`src/css/`)

CSS is split by concern: `vars.css` (custom properties — sizes, shadows, colors), `body.css` (resize cursors), `frame.css` (window/pane/muntin), `glass.css` (header/content/actions/tabs), `detached-glass.css` (floating panel + shadows + resize handles), `sill.css` (minimized dock). Theming is an attribute (`theme="…"` on `<bw-window>`, set via `setTheme`); CSS variables key off it. Drop previews, active-glass shadows, and resize cursors are all CSS-driven off attributes the JS toggles (`drop-area`, `[active]`, `maximized`, body classes).

---

## 11. Conventions for contributors

These are enforced project conventions (see `CLAUDE.md`):

- **Terminology** — use the window-construction metaphor (§1) precisely; don't pick a name whose well-known meaning differs from what the code does.
- **Naming** — suffix DOM-element variables with `El` and keep the noun specific (`activeGlassEl`, not `activeEl`); name accessors `get<Noun>`. Name constants for their context (`MIN_RESIZE_WIDTH`, not `MIN_WIDTH`).
- **Interaction code (preferred for new features)** — Pointer Events + `setPointerCapture` (one path for mouse/touch/pen; capture keeps move events flowing and self-releases) over document-bound `mouse*`; **delegated listeners on `windowElement`** (constant listener count); **create affordance DOM on demand** (on hover), not eagerly; scope child queries with `:scope > selector`. _Note:_ existing `resizable.js` and the attached-glass `drag.js` still use the older `document` + `mouse*` style; detached glass `move.js`/`resize.js` use the modern pattern.
- **Comments** — only when they add what the code doesn't say; ≤2 lines / 100 chars; prefix a genuinely longer one with `RATIONAL:`; wrap identifiers in backticks.
- **Debug sentinels** — repeating-digit literals (`222`, `333`) in default/fallback paths are intentional tripwires, **not** magic numbers. Don't tidy them. If one surfaces downstream, a guard upstream was bypassed — investigate that, don't rename it.
- **`dev/`** — test scaffolding, not shippable source. Interactive controls go in the `.html`; the paired `.js` queries them and wires behavior. Commits touching only `dev/` are plain `chore:`.
- **Git** — don't commit/push unless explicitly asked; no Claude co-author trailers.
