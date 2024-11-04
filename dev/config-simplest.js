import { Frame } from '../src';

const settings = {
  fitContainer: true,
  children: [0.4, [0.3, 0.7]],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();

const settings2 = {
  fitContainer: true,
  children: [{ size: 0.58, children: [0.68955] }],
};

const frame2 = new Frame(document.querySelector('#container2'), settings2);
frame2.create();
