import { Frame } from '../src';

const settings = {
  width: 600,
  height: 100,
  children: [0.4],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();
window.sash = frame.rootSash;

const settings2 = {
  width: 600,
  height: 100,
  children: [[0.4], 0.3],
};

const frame2 = new Frame(document.querySelector('#container-2'), settings2);
frame2.create();
window.sash2 = frame2.rootSash;
