import { Sash, Position, BinaryWindow } from '../src';

const rootSash = new Sash({
  top: 0,
  left: 0,
  width: 400,
  height: 300,
  position: Position.Root,
});

const sash_1 = new Sash({
  left: 0,
  top: 0,
  width: 400,
  height: 200,
  position: Position.Top,
});

const sash_1_1 = new Sash({
  top: 0,
  left: 0,
  width: 200,
  height: 200,
  position: Position.Left,
});

const sash_1_2 = new Sash({
  top: 0,
  left: 200,
  width: 200,
  height: 200,
  position: Position.Right,
});

sash_1.children.push(sash_1_1, sash_1_2);

const sash_2 = new Sash({
  top: 200,
  width: 400,
  height: 100,
  position: Position.Bottom,
});

rootSash.children.push(sash_1, sash_2);

const layout = new BinaryWindow(document.querySelector('#container'), rootSash, {
  fitContainer: true,
});
layout.create();
