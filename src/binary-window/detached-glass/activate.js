import { detachedGlassManager } from './manager';

export default {
  enableDetachedGlassActivate() {
    // Clicking anywhere in a detached glass brings it to front. Move/resize
    // grabs bubble here too, so focus handling lives in one place.
    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      const glassEl = event.target.closest?.('bw-glass[detached]');
      if (glassEl) detachedGlassManager.bringToFront(glassEl);
    });
  },
};
