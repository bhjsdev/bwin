import { detachedGlassManager } from './manager';

export const closeAction = {
  label: '',
  className: 'bw-glass-action--close',
  onClick: (event) => {
    const glassEl = event.target.closest('bw-glass[detached]');
    if (!glassEl) return;

    detachedGlassManager.remove(glassEl.id);
    glassEl.remove();
  },
};

export const DETACHED_GLASS_ACTIONS = [closeAction];
