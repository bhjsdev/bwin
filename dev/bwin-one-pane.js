import { BinaryWindow } from '../src';

const settings = {
  width: 400,
  height: 400,
  title: 'My title',
  // children: [{ size: 0.4, draggable: false, title: 'no drag' }],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

window.sash = bwin.rootSash;
