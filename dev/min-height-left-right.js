import { Frame } from '../src';

const settings = {
  width: 400,
  height: 400,
  children: [
    {
      size: 0.6,
      position: 'top',
      children: [{ size: 0.5, position: 'top', children: [{ size: 0.3, position: 'top' }] }, [0.5]],
    },
    [{ size: 0.4, position: 'top' }, [0.3]],
  ],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();
window.sash = frame.rootSash;
