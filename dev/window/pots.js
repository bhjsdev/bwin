import { BinaryWindow } from '../../src';

const settings = {
  width: 444,
  height: 333,
  children: [
    { position: 'left', size: '40%', id: 'left-pane' },
    {
      children: [
        { position: 'top', size: '30%', id: 'top-pane' },
        { position: 'bottom', size: '70%', id: 'bottom-pane' },
      ],
    },
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));
