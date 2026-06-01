# Binary Window

A lightweight window-tiling JavaScript library for the browser, featuring resizable panes, drag-and-drop, and more.

[![A bwin tiling layout with resizable panes showing charts and a data table](docs/screenshot.png)](https://bhjsdev.github.io/bwin-docs/)

[Documentation](https://bhjsdev.github.io/bwin-docs/)

## Development

Install dependencies, then:

```sh
pnpm install   # first time only

pnpm dev       # start the dev server
pnpm test      # run the tests
```

### Environment

Create a `.env.local` to set the default minimum width/height (in pixels) for a sash:

```sh
# .env.local
VITE_DEFAULT_SASH_MIN_WIDTH=100
VITE_DEFAULT_SASH_MIN_HEIGHT=100
```

