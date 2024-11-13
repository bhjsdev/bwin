import './index.css';

const files = [
  'basic',
  'resize-x',
  'resize-y',
  'fit-container',
  'add-pane-frame',
  'bwin-add-remove-panes',
  'config',
  'config-2',
  'config-array',
  'config-string',
  'config-simplest',
  'droppable',
  'resizable',
  'min-width',
  'min-width-top-bottom',
  'min-height',
  'min-height-left-right',
  'bwin-droppable',
].sort();

const navEl = document.createElement('nav');

navEl.innerHTML = `
  <menu class="_menu">
    <li><a href="/debug.html">Debug</a></li>
    ${files.map((file) => `<li><a href="/${file}.html">${file}</a></li>`).join('')}
  </menu>
`;

document.body.prepend(navEl);
