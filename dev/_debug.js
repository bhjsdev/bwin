import { BinaryWindow } from '../src';

const settings = {
  width: 444,
  height: 333,
  children: [
    { position: 'left', size: '40%' },
    {
      children: [
        { position: 'top', size: '30%' },
        { position: 'bottom', size: '70%' },
      ],
    },
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));
