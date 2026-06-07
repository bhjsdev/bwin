class DetachedGlassManager {
  constructor() {
    this.glasses = [];
    // Rising counter so the most recently grabbed glass stacks on top, like an OS window.
    this.topZIndex = 1;
  }

  addGlass(glassEl) {
    this.glasses.push(glassEl);
  }

  // The front-most glass owns the [active] marker (set in bringToFront).
  getActiveGlass() {
    return this.glasses.find((glassEl) => glassEl.hasAttribute('active')) ?? null;
  }

  bringToFront(glassEl) {
    // Already front-most (it owns the [active] marker) → nothing to raise.
    if (glassEl.hasAttribute('active')) return;

    this.topZIndex += 1;
    glassEl.style.zIndex = this.topZIndex;

    // Only the front-most glass keeps [active]; it drives the stronger shadow in CSS.
    glassEl.parentElement
      ?.querySelectorAll(':scope > bw-glass[detached][active]')
      .forEach((el) => el !== glassEl && el.removeAttribute('active'));
    glassEl.setAttribute('active', '');
  }

  removeGlass(id) {
    const index = this.glasses.findIndex((glassEl) => glassEl.id === id);

    if (index !== -1) {
      const [removedGlassEl] = this.glasses.splice(index, 1);
      return removedGlassEl;
    }

    return null;
  }
}

export const detachedGlassManager = new DetachedGlassManager();
