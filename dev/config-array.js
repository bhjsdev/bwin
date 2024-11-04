import { Frame } from '../src';

const settings = {
  width: 333,
  height: 222,
  children: [{ size: '40%' }, [{ size: '30%', 'position': 'top' }, { size: '70%' }]],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();
