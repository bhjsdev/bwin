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
  resizeStrategy: 'natural',
  children: [{ position: 'left', size: '50%', children: [{ position: 'left', size: '40%' }] }],
};

const f2 = new Frame(s2);
f2.mount(document.querySelector('#container-2'));

const s3 = {
  fitContainer: true,
  resizeStrategy: 'natural',
  children: [
    { position: 'top', size: '30%' },
    {
      children: [{ position: 'top', size: '40%' }],
    },
  ],
};

const f3 = new Frame(s3);
f3.mount(document.querySelector('#container-3'));

const s4 = {
  fitContainer: true,
  resizeStrategy: 'natural',
  children: [{ position: 'top', size: '30%', children: [{ position: 'top', size: '40%' }] }],
};

const f4 = new Frame(s4);
f4.mount(document.querySelector('#container-4'));

const s5 = {
  fitContainer: true,
  resizeStrategy: 'natural',
  children: [
    { position: 'left', size: '50%', children: [{ position: 'left', size: '50%' }] },
    {
      children: [{ position: 'left', size: '40%' }],
    },
  ],
};

const f5 = new Frame(s5);
f5.mount(document.querySelector('#container-5'));
