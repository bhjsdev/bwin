import { Frame } from '../src';

const settings = {
  width: 333,
  height: 222,
  children: [0.4, [{ size: 0.3, position: 'top' }, '70%']],
};

const frame = new Frame(settings);
frame.mount(document.querySelector('#container'));
