# Binary Window

[![Publish to npm](https://github.com/bhjsdev/bwin/actions/workflows/publish.yml/badge.svg)](https://github.com/bhjsdev/bwin/actions/workflows/publish.yml)
[![npm version](https://img.shields.io/npm/v/bwin)](https://www.npmjs.com/package/bwin)

A lightweight window-tiling JavaScript library for the browser, featuring resizable panes, drag-and-drop, and more. Works with any framework or none.

[![A bwin tiling layout with resizable panes showing charts and a data table](docs/screenshot.png)](https://bhjsdev.github.io/bwin-docs?theme=light)

## Quick start

Drop this into an `.html` file and open it in your browser — no build step required:

```html
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bwin@latest/dist/bwin.css" />
    <script type="importmap">
      { "imports": { "bwin": "https://cdn.jsdelivr.net/npm/bwin@latest/dist/bwin.min.js" } }
    </script>
    <script type="module">
      import { BinaryWindow } from 'bwin';

      const element = document.createElement('em');
      element.innerHTML = 'Hello World';

      const bwin = new BinaryWindow({
        width: 400,
        height: 300,
        children: [
          { position: 'left', size: 200, content: element },
          {
            position: 'right',
            children: [
              { position: 'top', size: '40%' },
              { position: 'bottom', size: '60%' },
            ],
          },
        ],
      });

      bwin.mount(document.getElementById('container'));
    </script>
  </head>
  <body>
    <div id="container"></div>
  </body>
</html>
```

To install from npm instead:

```sh
npm install bwin
```

```js
import { BinaryWindow } from 'bwin';
import 'bwin/bwin.css';
```

Installing from npm means using a bundler (Vite, webpack, Rollup, etc.) to build your app.

## Documentation

Full guides and API reference: [bhjsdev.github.io/bwin-docs](https://bhjsdev.github.io/bwin-docs/javascript/get-started)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development setup.
