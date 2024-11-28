import { BinaryWindow } from '../src';

const settings = {
  width: 600,
  height: 400,
  children: [
    { size: 0.4, children: [{ position: 'top', size: 0.3 }] },
    [
      { size: 0.4, position: 'top' },
      { size: 0.6, position: 'bottom', children: [0.5, 0.5] },
    ],
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

document.querySelector('#add-glass').addEventListener('click', () => {
  const parentId = document.querySelector('#sash-id').value.trim();
  const position = document.querySelector('input[name="sash-position"]:checked').value;
  bwin.addGlass(parentId, position, {
    actions: [],
    title: '<mark>New Glass</mark>',
    content: '<b>New Glass Content</b>',
  });
});

document.querySelector('#remove-glass').addEventListener('click', () => {
  const sashId = document.querySelector('#sash-id').value.trim();
  bwin.removeGlass(sashId, true);
});
