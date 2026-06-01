import './index.css';

const files = [
  'basic',
  'fit-container',
  'add-remove-pane',
  'config',
  'config-2',
  'config-array',
  'config-string',
  'config-simplest',
  'config-sash',
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
  'bwin-add-remove-panes',
  'bwin-drag-drop',
  'zombie-chrome-drag-bug',
  'bwin-multiple-windows',
  'bwin-one-pane',
  'resize-min-width-height',
  'bwin-minimize-restore',
  'resize-strategy',
  'resize-strategy-2',
].sort();

// First entry is the default shown when there is no hash
const DEFAULT_FILE = files[0];

const navEl = document.querySelector('nav');
const iframeEl = document.querySelector('#_frame');

function genLinkText(file) {
  const text = file.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  if (text.startsWith('Bwin')) {
    return text.replace('Bwin', '[bwin] ');
  }

  return text;
}

navEl.querySelector('._menu').insertAdjacentHTML(
  'beforeend',
  files.map((file) => `<li><a href="#${file}">${genLinkText(file)}</a></li>`).join('')
);

function route() {
  const name = location.hash.slice(1) || DEFAULT_FILE;

  iframeEl.src = `./${name}.html`;

  navEl.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${name}`);
  });
}

window.addEventListener('hashchange', route);
route();

navEl.querySelector('#_toggle-bg').addEventListener('click', () => {
  const bgColor = 'lavender';
  const bodyEl = iframeEl.contentDocument?.body;

  if (!bodyEl) return;

  bodyEl.style.backgroundColor = bodyEl.style.backgroundColor === bgColor ? '' : bgColor;
});
