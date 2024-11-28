import { BinaryWindow, BUILTIN_ACTIONS } from '../src';

const settings = {
  width: 555,
  height: 333,
  children: [
    {
      position: 'left',
      size: '40%',
      id: 'my-left-pane',
      content: 'Left',
      title: 'Left Pane',
      // draggable: false,
    },
    {
      position: 'right',
      size: '60%',
      children: [
        {
          position: 'top',
          size: '30%',
          id: 'my-right-top-pane',
          // Should not be droppable all the time
          droppable: false,
          actions: [
            {
              label: 'Update content',
              onClick: (event, glass) => {
                glass.headerElement.style.backgroundColor = 'lightblue';
                glass.contentElement.innerHTML = 'Content updated!';
              },
            },
            ...BUILTIN_ACTIONS,
            'A2',
          ],
          // should not be displayed when tabs are present
          title: 'Top Right Pane',
          content: '<mark>Top Right Pane</mark>',
        },
        {
          position: 'bottom',
          size: '70%',
          actions: null,
          tabs: [{ label: 'Tab 1' }, 'Tab 2'],
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
window.win = win;
