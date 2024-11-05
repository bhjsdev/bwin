import { Frame } from '../src';

const settings = {
  fitContainer: true,
  children: [0.4, [0.3]],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();

const settings2 = {
  fitContainer: true,
  children: [[0.689655], 0.42],
};

const frame2 = new Frame(document.querySelector('#container2'), settings2);
frame2.create();
