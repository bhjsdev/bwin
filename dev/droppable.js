import { Frame } from '../src';

const settings = {
  fitContainer: true,
  children: [0.4],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();
