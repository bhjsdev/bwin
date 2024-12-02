import { BinaryWindow } from '../src';

const settings1 = {
  fitContainer: true,
  children: [
    { size: 0.6, children: [[0.5], [{ position: 'top', size: 0.3 }]] },
    [
      { size: 0.4, position: 'top' },
      { size: 0.6, position: 'bottom', children: [0.5, 0.5] },
    ],
  ],
};

const bwin1 = new BinaryWindow(settings1);
bwin1.mount(document.querySelector('#container-1'));

const settings2 = {
  fitContainer: true,
  children: [
    { size: 0.6, children: [[0.5], [{ position: 'top', size: 0.3 }]] },
    [
      { size: 0.4, position: 'top' },
      { size: 0.6, position: 'bottom', children: [0.5, 0.5] },
    ],
  ],
};

const bwin2 = new BinaryWindow(settings2);
bwin2.mount(document.querySelector('#container-2'));
