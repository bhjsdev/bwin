import './index.css';

const files = [
  'basic',
  'resize-x',
  'resize-y',
  'fit-container',
  'min-max-pane-size',
  'add-pane-frame',
  'add-remove-panes-bwin',
  'config',
  'config-2',
  'config-array',
  'config-string',
  'config-simplest',
].sort();

const navEl = document.createElement('nav');

navEl.innerHTML = `
  <menu class="_menu">
    <li><a href="/debug.html">Debug</a></li>
    ${files.map((file) => `<li><a href="/${file}.html">${file}</a></li>`).join('')}
  </menu>
`;

document.body.prepend(navEl);
