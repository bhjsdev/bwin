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
