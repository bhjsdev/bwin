import { ConfigRoot, Frame } from '../src';

const settings = {
  width: 333,
  height: 222,
  children: [
    { position: 'left', size: '40%' },
    {
      position: 'right',
      size: '60%',
      children: [
        { position: 'top', size: '30%' },
        { position: 'bottom', size: '70%' },
      ],
    },
  ],
};

const config = new ConfigRoot(settings);

const frame = new Frame(document.querySelector('#container'), config);
frame.create();
