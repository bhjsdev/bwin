class DetachedGlassManager {
  constructor() {
    this.glasses = [];
  }

  addGlass(glassEl) {
    this.glasses.push(glassEl);
  }

  // The front-most glass owns the [active] marker (set in bringToFront).
  getActiveGlass() {
    return this.glasses.find((glassEl) => glassEl.hasAttribute('active')) ?? null;
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
