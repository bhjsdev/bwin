import { Frame } from '../src';

const settings = {
  width: 333,
  height: 222,
  children: [
    { position: 'left', size: '40%', minWidth: 55 },
    {
      position: 'right',
      size: '60%',
      children: [
        { position: 'top', size: '30%', minHeight: 99 },
        { position: 'bottom', size: '70%', minWidth: 144, minHeight: 44 },
      ],
    },
  ],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();
window.sash = frame.rootSash;
