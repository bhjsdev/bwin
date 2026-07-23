import { detachedGlassManager, windowlessGlassManager } from './manager';

export default {
  enableDetachedGlassActivate() {
    // Clicking anywhere in a detached glass brings it to front. Move/resize
    // grabs bubble here too, so focus handling lives in one place.
    document.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      const glassEl = event.target.closest?.('bw-glass[detached]');
      if (!glassEl) return;

      // Each kind has its own stack; raise within the owning manager.
      const manager = glassEl.hasAttribute('windowless')
        ? windowlessGlassManager
        : detachedGlassManager;
      manager.bringToFront(glassEl);
    });
  },
};
