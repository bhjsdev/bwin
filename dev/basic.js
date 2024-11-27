import { Frame } from '../src';

const settings = {
  width: 333,
  height: 222,
  children: [
    { position: 'left', size: '40%', id: 'my-left-pane' },
    {
      position: 'right',
      size: '60%',
      children: [
        { position: 'top', size: '30%', id: 'my-right-top-pane' },
        { position: 'bottom', size: '70%', id: 'my-right-bottom-pane' },
      ],
      id: 'my-right-horz-muntin',
    },
  ],
  id: 'my-root',
};

const frame = new Frame(settings);
frame.debug = false;
frame.mount(document.querySelector('#container'));

window.sash = frame.rootSash;
window.frame = frame;
