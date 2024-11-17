import './index.css';

const files = [
  'basic',
  'resize-x',
  'resize-y',
  'fit-container',
  'add-pane',
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
  'dom-node',
  'bwin-content',
].sort();

const navEl = document.createElement('nav');

function genLinkText(file) {
  const text = file.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  if (text.startsWith('Bwin')) {
    return text.replace('Bwin', '[bwin] ');
  }

  return text;
}

navEl.innerHTML = `
  <menu class="_menu">
    <li><a href="/debug.html">Debug</a></li>
    ${files.map((file) => `<li><a href="/${file}.html">${genLinkText(file)}</a></li>`).join('')}
  </menu>
`;

document.body.prepend(navEl);
