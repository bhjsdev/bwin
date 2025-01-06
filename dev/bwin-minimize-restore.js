import { BinaryWindow } from '../src';
import fitContainer from '../src/frame/fit-container';

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
          size: 0.5,
        },
      ],
    },
  ],
};

const win = new BinaryWindow(settings);
win.mount(document.querySelector('#container'));
