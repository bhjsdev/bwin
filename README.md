# Binary Window

[![Publish to npm](https://github.com/bhjsdev/bwin/actions/workflows/publish.yml/badge.svg)](https://github.com/bhjsdev/bwin/actions/workflows/publish.yml)
[![npm version](https://img.shields.io/npm/v/bwin)](https://www.npmjs.com/package/bwin)

A lightweight window-tiling JavaScript library for the browser, featuring resizable panes, drag-and-drop, and more.

[![A bwin tiling layout with resizable panes showing charts and a data table](docs/screenshot.png)](https://bhjsdev.github.io/bwin-docs?theme=light)

[Documentation](https://bhjsdev.github.io/bwin-docs/javascript/get-started)

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

