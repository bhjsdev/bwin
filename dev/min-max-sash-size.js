import { Frame } from '../src';

const settings = {
  width: 600,
  height: 100,
  children: [0.2],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();
window.sash = frame.rootSash;

const settings2 = {
  width: 600,
  height: 100,
  children: [0.2, [0.8]],
};

const frame2 = new Frame(document.querySelector('#container-2'), settings2);
frame2.create();
window.sash2 = frame2.rootSash;

const settings3 = {
  width: 600,
  height: 100,
  children: [0.2, [0.2, [0.4]]],
};

const frame3 = new Frame(document.querySelector('#container-3'), settings3);
frame3.create();
window.sash3 = frame2.rootSash;
