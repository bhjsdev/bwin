import { Sash, Position, BinaryWindow, SashConfig } from '../src';

const rootSash = new SashConfig({
  width: 200,
  height: 200,
  position: Position.Root,
});

const sash1 = new Sash({
  left: 0,
  top: 0,
  width: 200,
  height: 100,
  position: Position.Top,
});

const pane1 = new Sash({
  top: 0,
  left: 0,
  width: 100,
  height: 100,
  position: Position.Left,
});

const pane2 = new Sash({
  top: 0,
  left: 100,
  width: 100,
  height: 100,
  position: Position.Right,
});

sash1.children.push(pane1, pane2);

const sash2 = new Sash({
  top: 100,
  width: 200,
  height: 100,
  position: Position.Bottom,
});

const pane3 = new Sash({
  top: 100,
  width: 200,
  height: 50,
  position: Position.Top,
});

const pane4 = new Sash({
  top: 150,
  width: 200,
  height: 50,
  position: Position.Bottom,
});

sash2.children.push(pane3, pane4);
rootSash.children.push(sash1, sash2);

const bwin = new BinaryWindow(rootSash);
bwin.mount(document.querySelector('#container'));

document.querySelector('#add-pane').addEventListener('click', () => {
  const parentId = document.querySelector('#sash-id').value.trim();
  const position = document.querySelector('input[name="sash-position"]:checked').value;
  bwin.addPane(parentId, position);
});

document.querySelector('#remove-pane').addEventListener('click', () => {
  const sashId = document.querySelector('#sash-id').value.trim();
  bwin.removePane(sashId);
});
