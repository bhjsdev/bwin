import { BinaryWindow, ConfigRoot, mergeConfig } from '../../src';

const originalConfig = {
  id: 'root',
  width: 444,
  height: 333,
  children: [
    { id: 'pane-1', position: 'left', size: '40%', title: 'Pane 1' },
    {
      children: [
        { id: 'pane-2', position: 'top', size: '30%', title: 'Pane 2' },
        { id: 'pane-3', position: 'bottom', size: '70%', title: 'Pane 3' },
      ],
    },
  ],
};

const containerEl = document.querySelector('#container');
const bwin = new BinaryWindow(originalConfig);
bwin.mount(containerEl);

let exportedConfig = null;

document.querySelector('#export-config').addEventListener('click', () => {
  exportedConfig = bwin.exportConfig();
  console.log('exportedConfig', exportedConfig);
});

document.querySelector('#rebuild-window').addEventListener('click', () => {
  if (!exportedConfig) {
    console.warn('Export the config first');
    return;
  }

  const mergedConfig = mergeConfig(exportedConfig, originalConfig);

  containerEl.innerHTML = '';
  const rebuiltBwin = new BinaryWindow(mergedConfig);
  rebuiltBwin.mount(containerEl);
});
