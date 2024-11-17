import { BinaryWindow } from '../src';

const settings = {
  width: 333,
  height: 222,
  children: [
    { position: 'left', size: '40%', id: 'my-left-pane', content: 'Left' },
    {
      position: 'right',
      size: '60%',
      children: [
        { position: 'top', size: '30%', id: 'my-right-top-pane' },
        { position: 'bottom', size: '70%' },
      ],
      id: 'my-right-horz-muntin',
    },
  ],
  id: 'my-root',
};

const win = new BinaryWindow(document.querySelector('#container'), settings);
win.create();

window.sash = win.rootSash;
