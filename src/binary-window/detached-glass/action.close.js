import { detachedGlassManager } from './manager';
import { removeGlassBackdrop } from './utils';

export default {
  label: '',
  className: 'bw-glass-action--close',
  onClick: (event) => {
    const glassEl = event.target.closest('bw-glass[detached]');
    if (!glassEl) return;

    detachedGlassManager.removeGlassById(glassEl.id);
    glassEl.remove();

    // Remove the modal backdrop tied to this glass, if any (windowless modal glass).
    removeGlassBackdrop(glassEl.id);
  },
};
