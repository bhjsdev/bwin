import { BinaryWindow, Frame } from '../src';

const settings = {
  width: 444,
  height: 333,
  children: [
    { position: 'left', size: '40%', title: 'Left' },
    {
      position: 'right',
      size: '60%',
      children: [
        {
          position: 'top',
          size: 0.6,
          title: 'Top right',
          content: '<em>Drag disabled</em>',
          draggable: false,
        },
        {
          position: 'bottom',
          title: '<b>Drop disabled</b>',
          actions: [],
          droppable: false,
        },
      ],
    },
  ],
};

const frame = new Frame(settings);
frame.fitContainer = true;
frame.mount(document.querySelector('#frame-container'));

const win = new BinaryWindow(settings);
win.mount(document.querySelector('#window-container'));
