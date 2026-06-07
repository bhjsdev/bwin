import { detachedGlassManager } from './manager';

export default {
  label: '',
  className: 'bw-glass-action--close',
  onClick: (event) => {
    const glassEl = event.target.closest('bw-glass[detached]');
    if (!glassEl) return;

    detachedGlassManager.removeGlass(glassEl.id);
    glassEl.remove();
  },
};

