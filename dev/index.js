import './index.css';

const files = [
  'basic',
  'resize-x',
  'resize-y',
  'fit-container',
  'add-remove-pane',
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
  'dom-node',
  'bwin-content',
  'one-pane',
  'bwin-more',
  'bwin-add-remove-glasses',
  'release-check',
  'bwin-drag-drop',
  'zombie-chrome-drag-bug',
  'bwin-multiple-windows',
  'bwin-one-pane',
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
    <li><button id="_toggle-bg">Toggle BG</button></li>
    <li><a href="/_release-check.html"><b>Release check</b></a></li>
    <li><a href="/_debug.html">Debug</a></li>
    ${files.map((file) => `<li><a href="/${file}.html">${genLinkText(file)}</a></li>`).join('')}
  </menu>
`;

navEl.querySelector('#_toggle-bg').addEventListener('click', () => {
  const mainBgColor = 'lavender';
  const mainEl = document.querySelector('main');
  mainEl.style.backgroundColor = mainEl.style.backgroundColor === mainBgColor ? '' : mainBgColor;
});

document.body.prepend(navEl);
