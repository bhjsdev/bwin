import { Frame, mergeConfig } from '../../src';

const originalConfig = {
  id: 'root',
  width: 555,
  height: 444,
  children: [
    {
      position: 'left',
      size: '40%',
      children: [
        { id: 'pane-1', position: 'top', size: '50%', title: 'Pane 1' },
        { id: 'pane-2', position: 'bottom', size: '50%', title: 'Pane 2' },
      ],
    },
    {
      children: [
        { id: 'pane-3', position: 'top', size: '30%', title: 'Pane 3' },
        {
          position: 'bottom',
          size: '70%',
          children: [
            { id: 'pane-4', position: 'left', size: '50%', title: 'Pane 4' },
            { id: 'pane-5', position: 'right', size: '50%', title: 'Pane 5' },
          ],
        },
      ],
    },
  ],
};

const containerEl = document.querySelector('#container');

let frame = new Frame(originalConfig);
frame.mount(containerEl);

let exportedConfig = null;

document.querySelector('#export-config').addEventListener('click', () => {
  exportedConfig = frame.exportConfig();
  console.log('exportedConfig', exportedConfig);
});

document.querySelector('#rebuild-window').addEventListener('click', () => {
  const mergedConfig = mergeConfig(exportedConfig, originalConfig);
  containerEl.innerHTML = '';

  frame = new Frame(mergedConfig);
  frame.mount(containerEl);
});
