import { Sash, Position, Frame, SashConfig } from '../../src';

const twoPanes = {
  width: 555,
  height: 333,
  children: [
    { position: 'left', size: '50%', id: 'left' },
    { position: 'right', size: '50%', id: 'right' },
  ],
  id: 'root',
};

const threePanes = {
  width: 555,
  height: 333,
  children: [
    { position: 'left', size: '40%', id: 'left' },
    {
      position: 'right',
      size: '60%',
      children: [
        { position: 'top', size: '50%', id: 'right-top' },
        { position: 'bottom', size: '50%', id: 'right-bottom' },
      ],
      id: 'right-muntin',
    },
  ],
  id: 'root',
};

const nested = {
  width: 555,
  height: 333,
  children: [
    { position: 'top', size: '30%', id: 'top' },
    {
      position: 'bottom',
      size: '70%',
      children: [
        { position: 'left', size: '30%', id: 'bottom-left' },
        {
          position: 'right',
          size: '70%',
          children: [
            { position: 'top', size: '50%', id: 'inner-top' },
            { position: 'bottom', size: '50%', id: 'inner-bottom' },
          ],
          id: 'inner-muntin',
        },
      ],
      id: 'bottom-muntin',
    },
  ],
  id: 'root',
};

// A pre-built `SashConfig` exercises the other branch of `Frame.setup` (the tree
// is already compiled and doubles as its own config, so no `ConfigRoot` compile).
function buildSashConfig() {
  const sashTree = new SashConfig({ width: 555, height: 333 });

  // Left column split into two stacked panes.
  const left = new Sash({ left: 0, top: 0, width: 200, height: 333, position: Position.Left });
  const leftTop = new Sash({ left: 0, top: 0, width: 200, height: 166, position: Position.Top });
  const leftBottom = new Sash({
    left: 0,
    top: 166,
    width: 200,
    height: 167,
    position: Position.Bottom,
  });
  left.children.push(leftTop, leftBottom);

  // Right column: a top pane over a bottom row of two panes.
  const right = new Sash({ left: 200, top: 0, width: 355, height: 333, position: Position.Right });
  const rightTop = new Sash({ left: 200, top: 0, width: 355, height: 133, position: Position.Top });
  const rightBottom = new Sash({
    left: 200,
    top: 133,
    width: 355,
    height: 200,
    position: Position.Bottom,
  });
  const rightBottomLeft = new Sash({
    left: 200,
    top: 133,
    width: 177,
    height: 200,
    position: Position.Left,
  });
  const rightBottomRight = new Sash({
    left: 377,
    top: 133,
    width: 178,
    height: 200,
    position: Position.Right,
  });
  rightBottom.children.push(rightBottomLeft, rightBottomRight);
  right.children.push(rightTop, rightBottom);

  sashTree.children.push(left, right);
  return sashTree;
}

const frame = new Frame(twoPanes);
frame.mount(document.querySelector('#container'));

document.querySelector('#reframe-two').addEventListener('click', () => frame.reframe(twoPanes));
document.querySelector('#reframe-three').addEventListener('click', () => frame.reframe(threePanes));
document.querySelector('#reframe-nested').addEventListener('click', () => frame.reframe(nested));
document
  .querySelector('#reframe-sash')
  .addEventListener('click', () => frame.reframe(buildSashConfig()));

const errorEl = document.querySelector('#error');
document.querySelector('#custom-settings').value = JSON.stringify(threePanes, null, 2);

document.querySelector('#reframe-custom').addEventListener('click', () => {
  errorEl.textContent = '';

  try {
    frame.reframe(JSON.parse(document.querySelector('#custom-settings').value));
  }
  catch (err) {
    errorEl.textContent = err.message;
  }
});

window.frame = frame;
