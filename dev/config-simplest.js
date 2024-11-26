import { Frame } from '../src';

const settings = {
  fitContainer: true,
  children: [0.4, [0.3]],
};

const frame = new Frame(settings);
frame.mount(document.querySelector('#container'));

const settings2 = {
  fitContainer: true,
  children: [[0.689655], 0.42],
};

const frame2 = new Frame(settings2);
frame2.mount(document.querySelector('#container2'));
