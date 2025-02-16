import { Frame } from '../src';

const s1 = {
  fitContainer: true,
  resizeStrategy: 'natural',
  children: [
    { position: 'left', size: '50%' },
    {
      children: [{ position: 'left', size: '40%' }],
    },
  ],
};

const f1 = new Frame(s1);
f1.mount(document.querySelector('#container-1'));

const s2 = {
  fitContainer: true,
  resizeStrategy: 'classic',
  children: [
    { position: 'left', size: '50%' },
    {
      children: [{ position: 'left', size: '40%' }],
    },
  ],
};

const f2 = new Frame(s2);
f2.mount(document.querySelector('#container-2'));
