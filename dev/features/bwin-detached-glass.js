import { BinaryWindow, BUILTIN_ACTIONS, BUILTIN_ACTIONS_2 } from '../../src';

const elem = document.createElement('div');
const zIndex = 100;

elem.textContent = 'z-index: ' + zIndex;
elem.style.backgroundColor = 'hsl(120 100% 90%)';
elem.style.width = '200px';
elem.style.height = '400px';
elem.style.position = 'absolute';
elem.style.top = '0';
elem.style.left = '0';
elem.style.opacity = '0.8';
elem.style.zIndex = zIndex;

const elem2 = document.createElement('div');
elem2.textContent = 'z-index: ' + (zIndex + 1);
elem2.style.backgroundColor = 'hsl(240 100% 90%)';
elem2.style.width = '200px';
elem2.style.height = '400px';
elem2.style.position = 'absolute';
elem2.style.top = '50px';
elem2.style.left = '50px';
elem2.style.opacity = '0.8';
elem2.style.zIndex = zIndex + 1;

const parentElem = document.createElement('div');
parentElem.style.position = 'relative';
parentElem.style.width = '100%';
parentElem.style.height = '100%';
parentElem.appendChild(elem);
parentElem.appendChild(elem2);

const settings = {
  width: 444,
  height: 333,
  // actions: [
  //   [BUILTIN_ACTIONS[0], BUILTIN_ACTIONS[2]],
  //   ['A1', ...BUILTIN_ACTIONS_2],
  // ],
  children: [
    { position: 'left', size: '40%', actions: [], content: createGlassContent('left') },
    {
      children: [
        { position: 'top', size: '30%', content: createGlassContent('top-right') },
        { position: 'bottom', size: '70%', content: parentElem },
      ],
    },
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

// Distinguishable, interactive content so the glass body is visible while dragging.
function createGlassContent(label) {
  const wrapEl = document.createElement('div');
  wrapEl.style.padding = '8px';
  wrapEl.style.fontFamily = 'sans-serif';
  wrapEl.style.fontSize = '12px';

  const headingEl = document.createElement('h3');
  headingEl.textContent = `Content: ${label}`;
  headingEl.style.margin = '0 0 8px';
  wrapEl.appendChild(headingEl);

  const inputEl = document.createElement('input');
  inputEl.type = 'text';
  inputEl.placeholder = 'type here…';
  inputEl.style.width = '100%';
  inputEl.style.boxSizing = 'border-box';
  inputEl.style.marginBottom = '8px';
  wrapEl.appendChild(inputEl);

  const listEl = document.createElement('ul');
  listEl.style.margin = '0';
  listEl.style.paddingLeft = '18px';
  for (let i = 1; i <= 8; i += 1) {
    const itemEl = document.createElement('li');
    itemEl.textContent = `${label} — row ${i}`;
    listEl.appendChild(itemEl);
  }
  wrapEl.appendChild(listEl);

  return wrapEl;
}

const offsetInput = document.querySelector('#offset');
const offsetXInput = document.querySelector('#offsetX');
const offsetYInput = document.querySelector('#offsetY');

// Empty input → undefined, so genStylesByPosition can fall back to `offset`.
const toOffset = (input) => (input.value === '' ? undefined : Number(input.value));

document.querySelectorAll('button[data-position]').forEach((button) => {
  button.addEventListener('click', () => {
    bwin.addDetachedGlass({
      position: button.dataset.position,
      title: button.dataset.position,
      offset: Number(offsetInput.value),
      offsetX: toOffset(offsetXInput),
      offsetY: toOffset(offsetYInput),
      content: createGlassContent(button.dataset.position),
    });
  });
});

// No options → exercises the DetachedGlass constructor defaults.
document.querySelector('#add-default').addEventListener('click', () => {
  bwin.addDetachedGlass({ content: createGlassContent('default') });
})

document.querySelector('#add-default').click();