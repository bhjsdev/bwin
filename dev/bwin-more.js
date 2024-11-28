import { BinaryWindow } from '../src';

const settings = {
  width: 400,
  height: 400,
  fitContainer: true,
  children: [
    { size: 0.6, children: [[0.5], [{ position: 'top', size: 0.3 }]] },
    [
      { size: 0.4, position: 'top' },
      { size: 0.6, position: 'bottom', children: [0.5, 0.5] },
    ],
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

window.sash = bwin.rootSash;
