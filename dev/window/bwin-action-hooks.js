import { BinaryWindow, BUILTIN_ACTIONS } from '../../src';

const settings = {
  width: 444,
  height: 333,
  children: [
    { position: 'left', size: '40%', actions: BUILTIN_ACTIONS },
    {
      children: [
        { position: 'top', size: '30%' },
        { position: 'bottom', size: '70%' },
      ],
    },
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

bwin.on('detach', (glassEl) => {
  console.log('detach:', glassEl);
});

bwin.on('close', (glassEl) => {
  console.log('close:', glassEl);
});

bwin.on('maximize', (glassEl) => {
  console.log('maximize:', glassEl);
});

bwin.on('unmaximize', (glassEl) => {
  console.log('unmaximize:', glassEl);
});

bwin.on('minimize', (glassEl) => {
  console.log('minimize:', glassEl);
});

bwin.on('restore', (glassEl) => {
  console.log('restore:', glassEl);
});

bwin.on('attach', (glassEl) => {
  console.log('attach:', glassEl);
});
