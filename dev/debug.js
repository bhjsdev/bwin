import { Frame } from '../src';
import { getCursorPosition } from '../src/position';

// const settings = {
//   width: 300,
//   height: 200,
// };

// const frame = new Frame(document.querySelector('#container'), settings);

// frame.create();

// const paneEl = [...document.querySelectorAll('bw-pane')].at(-1);

// document.body.addEventListener('mousemove', (event) => {
//   const pos = { clientX: event.clientX, clientY: event.clientY };
//   const cursorPosition = getCursorPosition(paneEl, pos);
//   console.log('🐞 -> cursorPosition:', cursorPosition);
// });

const ext = {
  x: 1,
  fn() {
    console.log('ext.fn()');
  },
};

const MyClass = class {
  constructor() {
    this.x = 99;
  }

  fn() {
    console.log('MyClass.fn()');
  }
};

Object.assign(MyClass.prototype, ext);

class MySubClass extends MyClass {
  fn() {
    console.log('MySubClass.fn()');
  }
}

const myClass = new MyClass();
const mySubClass = new MySubClass();

console.log(myClass.x);

myClass.fn();
mySubClass.fn();
