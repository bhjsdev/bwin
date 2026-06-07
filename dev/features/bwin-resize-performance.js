import { BinaryWindow } from '../../src';

// A heavy backdrop-filter layer + many shadowed boxes: the whole region must
// re-blur whenever anything beneath repaints. left/top dragging repaints every
// frame (janky); a composited transform does not (smooth) — toggle to compare.
const lagLayer = document.createElement('div');
Object.assign(lagLayer.style, {
  position: 'absolute',
  inset: '0',
  pointerEvents: 'none',
  zIndex: '50',
  backdropFilter: 'blur(8px)',
  display: 'none',
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

const settings = {
  width: 444,
  height: 333,
  children: [{ position: 'left', size: 0.5, content: lagLayer }],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

const heavyPaintInput = document.querySelector('#heavy-paint');

const syncLagLayer = () => {
  lagLayer.style.display = heavyPaintInput.checked ? 'block' : 'none';
};

// Checked at load so the content renders without toggling first.
heavyPaintInput.checked = true;
syncLagLayer();

heavyPaintInput.addEventListener('change', syncLagLayer);
