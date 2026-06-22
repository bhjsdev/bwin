import './index.css';

// Auto-discover example pages from the three category folders. `import.meta.glob`
// is resolved by Vite at request time, so adding/removing a *.html there shows up
// in the menu after a browser refresh — no list to maintain.
const GROUPS = [
  { dir: 'misc', label: 'Misc' },
  { dir: 'window', label: 'Window' },
  { dir: 'frame', label: 'Frame' },
];

const modules = import.meta.glob('./{frame,window,misc}/*.html');

// Bucket discovered pages by their folder. `name` is the folder-qualified id used
// in the hash route (e.g. 'frame/basic'); `file` is the bare file name.
const groups = GROUPS.map(({ dir, label }) => {
  const files = Object.keys(modules)
    .filter((path) => path.startsWith(`./${dir}/`))
    .map((path) => path.slice(`./${dir}/`.length, -'.html'.length))
    .sort();

  return { dir, label, files };
}).filter((group) => group.files.length);

// Default shown when there is no hash — first real example, skipping the
// underscore-prefixed utility pages (_debug, _release-check) that sort first.
const allNames = groups.flatMap((g) => g.files.map((file) => `${g.dir}/${file}`));
const DEFAULT_NAME = allNames.find((name) => !name.split('/')[1].startsWith('_')) ?? allNames[0];

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
  groups
    .map(
      (group) => `
        <li class="_group">
          <details open>
            <summary>${group.label}</summary>
            <ul>
              ${group.files
                .map((file) => {
                  const name = `${group.dir}/${file}`;
                  return `<li><a href="#${name}">${genLinkText(file)}</a></li>`;
                })
                .join('')}
            </ul>
          </details>
        </li>`
    )
    .join('')
);

function route() {
  const name = location.hash.slice(1) || DEFAULT_NAME;

  iframeEl.src = `./${name}.html`;

  navEl.querySelectorAll('a').forEach((a) => {
    const isActive = a.getAttribute('href') === `#${name}`;
    a.classList.toggle('active', isActive);

    // Make sure the active link's group is expanded so it's visible.
    if (isActive) {
      a.closest('details')?.setAttribute('open', '');
    }
  });
}

window.addEventListener('hashchange', route);
route();

navEl.querySelector('#_toggle-theme').addEventListener('click', () => {
  const frameDoc = iframeEl.contentDocument;
  const windowEls = frameDoc?.querySelectorAll('bw-window');

  if (!windowEls?.length) return;

  const goDark = windowEls[0].getAttribute('theme') !== 'dark';

  // Windowless glasses float on the page body, outside bw-window, so theme them too.
  const themedEls = [...windowEls, ...frameDoc.querySelectorAll('bw-glass[windowless]')];

  themedEls.forEach((el) => {
    if (goDark) {
      el.setAttribute('theme', 'dark');
    }
    else {
      el.removeAttribute('theme');
    }
  });

  frameDoc.body.style.backgroundColor = goDark ? 'hsl(0 0% 12%)' : '';
  frameDoc.body.style.color = goDark ? 'hsl(0 0% 90%)' : '';
  frameDoc.documentElement.style.colorScheme = goDark ? 'dark' : '';
});
