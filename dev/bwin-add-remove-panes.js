import { BinaryWindow } from '../src';
import { genId } from '../src/utils';

const children1 = [
  {
    size: 0.4,
    children: [{ position: 'top', size: 0.3, id: 'top-left' }, { id: 'bottom-left' }],
  },
  [
    { size: 0.4, position: 'top' },
    { size: 0.6, position: 'bottom', children: [0.5, { size: 0.5, id: 'bottom-right' }] },
  ],
];

const children2 = [{ id: 'top-pane', size: 0.5, position: 'top' }, { id: 'bottom-pane' }];

const settings = {
  width: 600,
  height: 400,
  children: children1,
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

document.querySelector('#add-pane').addEventListener('click', () => {
  const parentId = document.querySelector('#sash-id').value.trim();
  const position = document.querySelector('input[name="sash-position"]:checked').value;

  bwin.addPane(parentId, {
    id: 'new-pane-' + genId(),
    position,
    size: 0.5,
    actions: [],
    title: '<mark>New Glass</mark>',
    content: '<b>New Glass Content</b>',
  });
});

document.querySelector('#remove-pane').addEventListener('click', () => {
  const sashId = document.querySelector('#sash-id').value.trim();
  bwin.removePane(sashId);
});

window.bwin = bwin;
