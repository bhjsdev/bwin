import { Frame } from '../src';

const settings = {
  width: 666,
  height: 444,
  children: [
    {
      position: 'left',
      size: 0.3,
      children: [0.5, [0.5, [0.5, 0.5]]],
    },
    {
      position: 'right',
      children: [
        {
          position: 'top',
          size: 0.4,
          children: [
            { position: 'top', size: 0.5 },
            {
              children: [
                { position: 'top', size: 0.5 },
                { children: [{ position: 'top', size: 0.5 }] },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const frame = new Frame(settings);
frame.debug = false;
frame.mount(document.querySelector('#container'));
