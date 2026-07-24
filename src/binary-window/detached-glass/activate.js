export default {
  enableDetachedGlassActivate() {
    // Delegated on `windowElement` (not `document`) so it's scoped to this window's
    // own glasses and dies with the element — a `document` listener would outlive a
    // rebuilt window and race the live one on the `active` guard in `bringToFront`.
    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      const glassEl = event.target.closest?.('bw-glass[detached]');
      if (!glassEl) return;

      this.detachedGlassManager.bringToFront(glassEl);
    });
  },
};
