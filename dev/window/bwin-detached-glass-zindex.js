import { BinaryWindow, BUILTIN_ACTIONS, detachedGlassManager } from '../../src';

const settings = {
  width: 777,
  height: 444,
  actions: [BUILTIN_ACTIONS],
  children: [
    { position: 'left', size: '40%', content: 'Left pane', title: 'Left pane' },
    { content: 'Right pane', title: 'Right pane' },
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

const baseZIndexInput = document.querySelector('#base-zindex');

// Push the base z-index; the next glass raised via bringToFront starts stacking from here.
document.querySelector('#set-base-zindex').addEventListener('click', () => {
  detachedGlassManager.setBaseZIndex(Number(baseZIndexInput.value));
});

let count = 0;
document.querySelector('#add-glass').addEventListener('click', () => {
  count += 1;
  bwin.addDetachedGlass({
    position: 'center',
    offset: count * 24,
    title: `Glass ${count}`,
    content: `Glass ${count}`,
  });
});
