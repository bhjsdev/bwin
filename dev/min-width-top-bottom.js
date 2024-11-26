import { Frame } from '../src';

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

const frame = new Frame(settings);
frame.mount(document.querySelector('#container'));

window.sash = frame.rootSash;
