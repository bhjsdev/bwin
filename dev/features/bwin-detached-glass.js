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
  actions: [
    [BUILTIN_ACTIONS[0], BUILTIN_ACTIONS[2]],
    ['XXX', BUILTIN_ACTIONS_2[0]],
  ],
  children: [
    { position: 'left', size: '40%', actions: [] },
    {
      children: [
        { position: 'top', size: '30%' },
        { position: 'bottom', size: '70%', content: parentElem },
      ],
    },
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

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
    });
  });
});

// No options → exercises the DetachedGlass constructor defaults.
document.querySelector('#add-default').addEventListener('click', () => {
  bwin.addDetachedGlass();
});

// A heavy backdrop-filter layer + many shadowed boxes: the whole region must
// re-blur whenever anything beneath repaints. left/top dragging repaints every
// frame (janky); a composited transform does not (smooth) — compare by dragging.
const lagLayer = document.createElement('div');
Object.assign(lagLayer.style, {
  position: 'absolute',
  inset: '0',
  pointerEvents: 'none',
  backdropFilter: 'blur(8px)',
});

for (let i = 0; i < 400; i++) {
  const box = document.createElement('div');
  Object.assign(box.style, {
    position: 'absolute',
    left: `${(i * 37) % 90}%`,
    top: `${(i * 53) % 90}%`,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: `hsl(${(i * 17) % 360} 80% 60% / 0.5)`,
    boxShadow: '0 0 40px 20px rgba(0,0,0,0.25)',
    filter: 'blur(2px)',
  });
  lagLayer.appendChild(box);
}

document.querySelector('#add-lag-layer').addEventListener('click', () => {
  bwin.addDetachedGlass({content: lagLayer.cloneNode(true)});
});