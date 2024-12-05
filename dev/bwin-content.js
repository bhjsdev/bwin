import { BinaryWindow, BUILTIN_ACTIONS } from '../src';

const isDraggable = false;
const isDroppable = false;
const minWidth = 100;
const minHeight = 133;

const settings = {
  width: 666,
  height: 333,
  children: [
    {
      position: 'left',
      size: '45%',
      id: 'my-left-pane',
      title: `draggable: ${isDraggable}`,
      draggable: isDraggable,
      minWidth: minWidth,
      content: `<mark>min width ${minWidth}</mark>`,
    },
    {
      position: 'right',
      children: [
        {
          position: 'top',
          size: '30%',
          minHeight: minHeight,
          id: 'my-right-top-pane',
          // Should not be droppable all the time
          droppable: isDroppable,
          actions: [
            {
              label: 'Update',
              onClick: (event) => {
                const buttonEl = event.target;
                const headerEl = buttonEl.closest('bw-glass-header');
                headerEl.style.backgroundColor = 'lightblue';

                const contentEl = buttonEl.closest('bw-glass').querySelector('bw-glass-content');
                contentEl.innerHTML = 'Content updated!';
              },
            },
            ...BUILTIN_ACTIONS,
            'A2',
          ],
          title: `droppable: ${isDroppable}`,
          content: `<mark>min height ${minHeight}</mark>`,
        },
        {
          position: 'bottom',
          size: '70%',
          actions: null,
          title: 'My title',
          tabs: [{ label: 'Tab 1' }, 'Tab 2'],
          // should not be displayed when tabs are present
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
