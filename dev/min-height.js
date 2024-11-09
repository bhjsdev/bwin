import { Frame } from '../src';

const settings = {
  width: 100,
  height: 500,
  children: [{ position: 'top', size: 0.2 }],
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.create();
window.sash = frame.rootSash;

const settings2 = {
  width: 100,
  height: 500,
  children: [{ position: 'top', size: 0.2 }, [{ position: 'top', size: 0.2 }]],
};

const frame2 = new Frame(document.querySelector('#container-2'), settings2);
frame2.create();
window.sash2 = frame2.rootSash;

const settings3 = {
  width: 100,
  height: 500,
  children: [
    { position: 'top', size: 0.2 },
    [{ position: 'top', size: 0.2 }, [{ position: 'top', size: 0.4 }]],
  ],
};

const frame3 = new Frame(document.querySelector('#container-3'), settings3);
frame3.create();
window.sash3 = frame3.rootSash;

const settings4 = {
  width: 100,
  height: 500,
  children: [
    { position: 'top', size: 0.2, children: [{ position: 'top', size: 0.3 }] },
    [{ position: 'top', size: 0.2 }, [{ position: 'top', size: 0.4 }]],
  ],
};

const frame4 = new Frame(document.querySelector('#container-4'), settings4);
frame4.create();
window.sash4 = frame4.rootSash;
