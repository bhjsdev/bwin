import { Sash, Position, Frame, SashConfig } from '../src';

const rootSash = new SashConfig({
  width: 400,
  height: 300,
  fitContainer: true,
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
rootSash.fitContainer = true;

const layout = new Frame(document.querySelector('#container'), rootSash);
layout.create();

const settings = {
  width: 200,
  height: 100,
  fitContainer: true,
  children: [0.4, [0.3]],
};

const frame = new Frame(document.querySelector('#container2'), settings);
frame.create();

let fit = true;
document.querySelector('#toggle-fit-container').addEventListener('click', () => {
  fit = !fit;
  frame.fitContainer = fit;
});
