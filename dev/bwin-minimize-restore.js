import { BinaryWindow } from '../src';

const settings = {
  fitContainer: true,
  children: [
    {
      position: 'left',
      size: '45%',
    },
    {
      position: 'right',
      children: [
        {
          position: 'top',
          id: 'top-right',
          size: 0.5,
        },
      ],
    },
  ],
};

const win = new BinaryWindow(settings);
win.mount(document.querySelector('#container'));
