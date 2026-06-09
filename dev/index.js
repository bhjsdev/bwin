import './index.css';

// Auto-discover example pages from `features/`. `import.meta.glob` is resolved
// by Vite at request time, so adding/removing a *.html there shows up in the
// menu after a browser refresh — no list to maintain.
const files = Object.keys(import.meta.glob('./features/*.html'))
  .map((path) => path.slice('./features/'.length, -'.html'.length)) // './features/basic.html' -> 'basic'
  .sort();

// Default shown when there is no hash — first real example, skipping the
// underscore-prefixed utility pages (_debug, _release-check) that sort first.
const DEFAULT_FILE = files.find((name) => !name.startsWith('_')) ?? files[0];

const navEl = document.querySelector('nav');
const iframeEl = document.querySelector('#_frame');

function genLinkText(file) {
  const text = file
    .replace(/^_+/, '') // '_debug' -> 'debug'
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

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

  iframeEl.src = `./features/${name}.html`;

  navEl.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${name}`);
  });
}

window.addEventListener('hashchange', route);
route();

navEl.querySelector('#_toggle-theme').addEventListener('click', () => {
  const frameDoc = iframeEl.contentDocument;
  const windowEls = frameDoc?.querySelectorAll('bw-window');

  if (!windowEls?.length) return;

  const goDark = windowEls[0].getAttribute('theme') !== 'dark';

  windowEls.forEach((windowEl) => {
    if (goDark) {
      windowEl.setAttribute('theme', 'dark');
    } else {
      windowEl.removeAttribute('theme');
    }
  });

  frameDoc.body.style.backgroundColor = goDark ? 'hsl(0 0% 12%)' : '';
  frameDoc.body.style.color = goDark ? 'hsl(0 0% 90%)' : '';
  frameDoc.documentElement.style.colorScheme = goDark ? 'dark' : '';
});
