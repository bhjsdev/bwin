import { Frame } from '../src';

const settings = {
  width: 333,
  height: 222,
};

const frame = new Frame(settings);
frame.mount(document.querySelector('#container'));
