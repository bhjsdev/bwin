import { BinaryWindow, BUILTIN_ACTIONS } from '../src';

const settings = {
  width: 555,
  height: 333,
  children: [
    { position: 'left', size: '40%', id: 'my-left-pane', content: 'Left', title: 'Left Pane' },
    {
      position: 'right',
      size: '60%',
      children: [
        {
          position: 'top',
          size: '30%',
          id: 'my-right-top-pane',
          tabs: [{ label: 'Tab 1' }, 'Tab 2'],
          actions: [{ label: 'A1', onClick: (event, glass, win) => {} }, ...BUILTIN_ACTIONS, 'A2'],
          title: 'Top Right Pane', // should not be displayed when tabs are present
          content: '<mark>Top Right Pane</mark>',
        },
        {
          position: 'bottom',
          size: '70%',
          actions: null,
          content: 'Bottom Right Pane',
        },
      ],
      id: 'my-right-horz-muntin',
    },
  ],
  id: 'my-root',
};

const win = new BinaryWindow(settings);
win.mount(document.querySelector('#container'));

window.sash = win.rootSash;
