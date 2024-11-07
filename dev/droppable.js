import { Frame } from '../src';

const settings = {
  children: [100],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();
