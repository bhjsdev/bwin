import { BinaryWindow } from '../binary-window';

export default {
  type: 'detached-glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--close',
  onClick: async (event, binaryWindow) => {
    const glassEl = event.target.closest('bw-glass[detached]');
    if (!glassEl) return;

    if (glassEl.hasAttribute('windowless')) {
      await BinaryWindow.removeWindowlessGlass(glassEl.id);
    }
    else {
      await binaryWindow.removeDetachedGlass(glassEl.id);
      binaryWindow.emit('close', glassEl);
    }
  },
};
