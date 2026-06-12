# Downstream contract — `react-bwin`

`react-bwin` (`../react-bwin`) is the React wrapper that depends on `bwin`. It exposes a `<Window>` component using a `panes` prop instead of `children`, and forwards an imperative handle (`fit()`, `addPane()`, `removePane()`) that delegates to the bwin instance.

Because **React must own DOM creation** but bwin's `mount()` creates DOM itself, the wrapper bypasses bwin's normal API and reaches into internals. Each coupling point below is a place where changing bwin's internal structure will break react-bwin — and a candidate for public API that would let the wrapper stop depending on private structure.

> Keep this in mind when refactoring `Frame`/`BinaryWindow` internals, the `sash.store` bag, or the actions defaults. A summary lives in [`ARCHITECTURE.md` §9](../ARCHITECTURE.md#9-public-api-surface-srcindexjs); this file is the detailed list.

---

## Coupling points

- **Skips `mount()`** — manually sets `bwin.windowElement`, `bwin.containerElement`, `bwin.sillElement`, then calls `bwin.enableFeatures()` directly. Depends on the exact internal split between `frame()` (DOM creation) and `enableFeatures()` (interaction wiring).
  - *Would be removed by:* a "bring-your-own-DOM" / hydrate mode that attaches features to existing elements.
- **Walks the sash tree** — `bwin.rootSash.walk(sash => ...)` using `sash.children`, `sash.leftChild`, `sash.topChild` to decide pane vs muntin and render them itself.
  - *Would be removed by:* a public traversal API or a serializable layout descriptor.
- **Mutates `sash.domNode`** — sets it from React refs after render, since React (not bwin) creates the nodes.
- **Reads `sash.store.*`** — `actions`, `title`, `content`, `droppable`, `draggable`, `resizable`. The `store` "non-core props" bag is effectively **the integration contract** (see [`ARCHITECTURE.md` §6](../ARCHITECTURE.md#6-the-store-bag-non-core-props-sashstore)).
- **`addPane` content workaround** — bwin's `addPane` expects DOM-node content; React strips `content`, calls `addPane`, then queries the rendered `bw-pane[sash-id="…"] bw-glass-content` and `createPortal`s the ReactNode into it. Couples to bwin's internal tag names.
  - *Would be removed by:* an API to get the content container for a sash, or a content-slot hook.
- **Re-implements the actions default logic inline** — `actions === undefined ? DEFAULT_GLASS_ACTIONS : Array.isArray ? ... : []` — because it renders panes without bwin's `Glass`. It imports `DEFAULT_GLASS_ACTIONS` (historically `BUILTIN_ACTIONS`) from bwin directly. **This duplicated logic must be kept in sync by hand** — the `undefined`-vs-`null` contract in [`ARCHITECTURE.md` §6](../ARCHITECTURE.md#6-the-store-bag-non-core-props-sashstore) is load-bearing here.
- **Duplicates muntin geometry** — `Muntin.tsx` recomputes divider geometry (`MUNTIN_SIZE = 4`, left/top from `leftChild.width`/`topChild.height`) that bwin also computes internally.
- **Hand-maintains TypeScript types** — ships `src/bwin.d.ts` shimming `declare module 'bwin'` because **bwin publishes no TypeScript types** (no `types` field in `package.json`).
  - *Would be removed by:* shipping `.d.ts` from bwin.

---

## Practical implications

- **Version drift is expected** — react-bwin's `package.json` may pin an older `bwin` than the current core version; the wrapper can lag.
- **Before renaming/removing any of:** `windowElement` · `containerElement` · `sillElement` · `rootSash` · `enableFeatures()` · `frame()` · sash tree shape (`children`/`leftChild`/`topChild`/`domNode`) · `sash.store` keys · `DEFAULT_GLASS_ACTIONS` · the `bw-pane`/`bw-glass-content` tag names · `MUNTIN_SIZE` (4px) — check react-bwin and update it in lockstep, or land a public-API replacement first.
