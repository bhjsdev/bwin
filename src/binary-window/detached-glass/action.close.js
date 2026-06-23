import { detachedGlassManager } from './manager';

export default {
  type: 'detached-glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--close',
  onClick: (event) => {
    const glassEl = event.target.closest('bw-glass[detached]');
    if (!glassEl) return;

    // Manager handles both detached and windowless glass (no binaryWindow needed).
    detachedGlassManager.removeDetachedGlass(glassEl.id, { animateClose: true });
  },
};
