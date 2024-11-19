import { BinaryWindow } from '../src';

const settings = {
  width: 333,
  height: 222,
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
          actions: ['A1', 'A2'],
          title: 'Top Right Pane', // should not be displayed when tabs are present
        },
        { position: 'bottom', size: '70%', actions: ['B1', 'B2'] },
      ],
      id: 'my-right-horz-muntin',
    },
  ],
  id: 'my-root',
};

const win = new BinaryWindow(document.querySelector('#container'), settings);
win.create();

document.querySelector('#toggle-background').addEventListener('click', () => {
  const mainBgColor = 'lavender';
  const mainEl = document.querySelector('main');
  mainEl.style.backgroundColor = mainEl.style.backgroundColor === mainBgColor ? '' : mainBgColor;
});

window.sash = win.rootSash;
