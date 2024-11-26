import { Frame } from '../src';

const settings = {
  width: 333,
  height: 222,
  resizable: false,
  children: [
    { position: 'left', size: '40%' },
    {
      position: 'right',
      size: '60%',
      id: 'resizer',
      // resizable: false,
      children: [
        { position: 'top', size: '30%' },
        { position: 'bottom', size: '70%' },
      ],
    },
  ],
};

const frame = new Frame(settings);
frame.mount(document.querySelector('#container'));

const resizer = document.querySelector('[sash-id="resizer"]');
let resizable = resizer.getAttribute('resizable') !== 'false';

document.querySelector('#toggle-resizable').addEventListener('click', (event) => {
  resizable = !resizable;
  event.target.textContent = resizable
    ? 'Disable resizable on right panes'
    : 'Enable resizable on right panes';
  resizer.setAttribute('resizable', resizable);
});

window.sash = frame.rootSash;
