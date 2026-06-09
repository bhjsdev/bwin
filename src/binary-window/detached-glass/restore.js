import { detachedGlassManager } from './manager';

export default {
  // Restore a minimized detached glass: un-hide it, drop its sill button, raise it.
  // Keyed on bwDetachedGlassElement so it ignores tiled glasses' sill buttons.
  handleMinimizedDetachedGlassClick() {
    this.sillElement.addEventListener('click', (event) => {
      const minimizedDetachedGlassEl = event.target;
      if (!minimizedDetachedGlassEl.matches('.bw-minimized-detached-glass')) return;

      const detachedGlassEl = minimizedDetachedGlassEl.bwDetachedGlassElement;
      if (!detachedGlassEl) return;

      detachedGlassEl.style.display = '';
      minimizedDetachedGlassEl.remove();
      detachedGlassManager.bringToFront(detachedGlassEl);
    });
  },
};
