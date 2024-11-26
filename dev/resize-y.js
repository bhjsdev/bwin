import { Sash, Position, Frame, SashConfig } from '../src';

const rootSash = new SashConfig({ width: 200, height: 400 });

const sash_1 = new Sash({
  left: 0,
  top: 0,
  width: 200,
  height: 200,
  position: Position.Top,
  id: 'sash-1',
});

const sash_1_1 = new Sash({
  top: 0,
  left: 0,
  width: 200,
  height: 100,
  position: Position.Top,
  id: 'sash-1-1',
});

const sash_1_2 = new Sash({
  top: 100,
  left: 0,
  width: 200,
  height: 100,
  position: Position.Bottom,
  id: 'sash-1-2',
});

const sash_1_2_1 = new Sash({
  top: 100,
  left: 0,
  width: 70,
  height: 100,
  position: Position.Left,
  id: 'sash-1-2-1',
});

const sash_1_2_2 = new Sash({
  top: 100,
  left: 70,
  width: 130,
  height: 100,
  position: Position.Right,
  id: 'sash-1-2-2',
});

const sash_2 = new Sash({
  top: 200,
  left: 0,
  width: 200,
  height: 200,
  position: Position.Bottom,
  id: 'sash-2',
});

const sash_2_1 = new Sash({
  top: 200,
  left: 0,
  width: 100,
  height: 200,
  position: Position.Left,
  id: 'sash-2-1',
});

const sash_2_2 = new Sash({
  top: 200,
  left: 100,
  width: 100,
  height: 200,
  position: Position.Right,
  id: 'sash-2-2',
});

rootSash.children.push(sash_1, sash_2);
sash_1.children.push(sash_1_1, sash_1_2);
sash_1_2.children.push(sash_1_2_1, sash_1_2_2);
sash_2.children.push(sash_2_1, sash_2_2);

const layout = new Frame(rootSash);
layout.mount(document.querySelector('#resize-y'));

document.querySelector('#up').addEventListener('click', () => {
  const step = 8;

  sash_1.height -= step;
  sash_2.height += step;
  sash_2.top -= step;

  // sash_1_1.height -= step;
  // sash_1_2.height += step;
  // sash_1_2.top -= step;

  layout.update();
});

document.querySelector('#down').addEventListener('click', () => {
  const step = -8;

  sash_1.height -= step;
  sash_2.height += step;
  sash_2.top -= step;

  // sash_1_1.height -= step;
  // sash_1_2.height += step;
  // sash_1_2.top -= step;

  layout.update();
});
