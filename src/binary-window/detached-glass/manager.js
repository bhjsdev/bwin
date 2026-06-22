class DetachedGlassManager {
  constructor() {
    this.detachedGlassElements = [];
    // Rising counter so the most recently grabbed glass stacks on top, like an OS window.
    this.topZIndex = 1;
  }

  addDetachedGlassByElement(glassEl) {
    this.detachedGlassElements.push(glassEl);
  }

  // The front-most glass owns the [active] marker (set in bringToFront).
  getActiveDetachedGlass() {
    return this.detachedGlassElements.find((glassEl) => glassEl.hasAttribute('active')) ?? null;
  }

  bringToFront(glassEl) {
    // Already front-most (it owns the [active] marker) → nothing to raise.
    if (glassEl.hasAttribute('active')) return;

    // Reserve 1 for modal on windowless glass
    this.topZIndex += 2;
    glassEl.style.zIndex = this.topZIndex;

    // Only the front-most glass keeps [active]; it drives the stronger shadow in CSS.
    // Cleared across all managed glasses, so a detached and a windowless glass
    // (different parents) can't both look active at once.
    this.detachedGlassElements.forEach((el) => el !== glassEl && el.removeAttribute('active'));
    glassEl.setAttribute('active', '');

    return this.topZIndex;
  }

  removeDetachedGlassById(id) {
    const index = this.detachedGlassElements.findIndex((glassEl) => glassEl.id === id);

    if (index !== -1) {
      const [removedGlassEl] = this.detachedGlassElements.splice(index, 1);
      return removedGlassEl;
    }

    return null;
  }

  removeDetachedGlassByElement(glassEl) {
    if (!glassEl) return null;
    this.removeDetachedGlassById(glassEl.id);
    return glassEl;
  }
}

export const detachedGlassManager = new DetachedGlassManager();
