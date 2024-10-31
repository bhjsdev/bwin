import { Sash, Position, Frame, SashConfig } from '../src';

const sashTree = new SashConfig({ width: 400, height: 200 });

const sash1 = new Sash({
  left: 0,
  top: 0,
  width: 200,
  height: 200,
  position: Position.Left,
});

const pane1 = new Sash({
  top: 0,
  left: 0,
  width: 100,
  height: 200,
  position: Position.Left,
});

const pane2 = new Sash({
  top: 0,
  left: 100,
  width: 100,
  height: 200,
  position: Position.Right,
});

sash1.children.push(pane1, pane2);

const sash2 = new Sash({
  top: 0,
  left: 200,
  width: 200,
  height: 100,
  position: Position.Right,
});

const pane3 = new Sash({
  top: 0,
  left: 200,
  width: 200,
  height: 100,
  position: Position.Top,
});

const sash3 = new Sash({
  top: 100,
  left: 200,
  width: 200,
  height: 100,
  position: Position.Bottom,
});

const pane4 = new Sash({
  top: 100,
  left: 200,
  width: 100,
  height: 100,
  position: Position.Left,
});

const pane5 = new Sash({
  top: 100,
  left: 300,
  width: 100,
  height: 100,
  position: Position.Right,
});

sash3.children.push(pane4, pane5);

sash2.children.push(pane3, sash3);

sashTree.children.push(sash1, sash2);

const layout = new Frame(document.querySelector('#resize-x'), sashTree);
layout.create();

document.querySelector('#left').addEventListener('click', () => {
  const step = -8;

  sash1.width += step;
  sash2.left += step;
  sash2.width -= step;

  // pane4.width += step;
  // pane5.left += step;
  // pane5.width -= step;

  layout.update();
});

document.querySelector('#right').addEventListener('click', () => {
  const step = 8;

  sash1.width += step;
  sash2.left += step;
  sash2.width -= step;

  // pane4.width += step;
  // pane5.left += step;
  // pane5.width -= step;

  layout.update();
});
