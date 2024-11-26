import { Frame } from '../src';

const settings = {
  width: 100,
  height: 500,
  children: [{ position: 'top', size: 0.2 }],
};

const frame = new Frame(settings);
frame.mount(document.querySelector('#container'));
window.sash = frame.rootSash;

const settings2 = {
  width: 100,
  height: 500,
  children: [{ position: 'top', size: 0.2 }, [{ position: 'top', size: 0.2 }]],
};

const frame2 = new Frame(settings2);
frame2.mount(document.querySelector('#container-2'));
window.sash2 = frame2.rootSash;

const settings3 = {
  width: 100,
  height: 500,
  children: [
    { position: 'top', size: 0.2 },
    [{ position: 'top', size: 0.2 }, [{ position: 'top', size: 0.4 }]],
  ],
};

const frame3 = new Frame(settings3);
frame3.mount(document.querySelector('#container-3'));
window.sash3 = frame3.rootSash;

const settings4 = {
  width: 100,
  height: 500,
  children: [
    { position: 'top', size: 0.2, children: [{ position: 'top', size: 0.3 }] },
    [{ position: 'top', size: 0.2 }, [{ position: 'top', size: 0.4 }]],
  ],
};

const frame4 = new Frame(settings4);
frame4.mount(document.querySelector('#container-4'));
window.sash4 = frame4.rootSash;
