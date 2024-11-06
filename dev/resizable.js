import { Frame } from '../src';

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

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();

let enabled = true;

document.querySelector('#toggle-resizable').addEventListener('click', (event) => {
  enabled = !enabled;
  event.target.textContent = enabled ? 'Disable Resizable' : 'Enable Resizable';
  frame.resizable = enabled;
});
