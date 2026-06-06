class DetachedGlassManager {
  constructor() {
    this.glasses = [];
  }

  add(glass) {
    this.glasses.push(glass);
  }

  remove(id) {
    const index = this.glasses.findIndex((g) => g.id === id);

    if (index !== -1) {
      const [removed] = this.glasses.splice(index, 1);
      return removed;
    }

    return null;
  }
}

export const detachedGlassManager = new DetachedGlassManager();
