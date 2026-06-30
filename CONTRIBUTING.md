# Contributing

## Development

Install dependencies, then:

```sh
pnpm install   # first time only
pnpm dev       # start the dev server
pnpm test      # run the tests
```

## Environment

Create a `.env.local` to set the default minimum width/height (in pixels) for a sash:

```sh
# .env.local
VITE_DEFAULT_SASH_MIN_WIDTH=100
VITE_DEFAULT_SASH_MIN_HEIGHT=100
```

## Working with react-bwin

[`react-bwin`](https://github.com/bhjsdev/react-bwin) consumes bwin's **built**
output (`dist/bwin.js`), not `src/`. To develop both together (assuming the
repos are siblings), link them and rebuild bwin on save:

In `react-bwin`, symlink to your local bwin checkout (don't commit this):

```sh
pnpm add bwin@link:../bwin
```

In `bwin`, regenerate `dist/bwin.js` on every change:

```sh
pnpm build:watch
```

In `react-bwin`, start the dev server (hot-reloads through the symlink):

```sh
pnpm dev
```

`pnpm dev` still works in bwin alongside `build:watch` if you want bwin's own
dev pages running at the same time.
