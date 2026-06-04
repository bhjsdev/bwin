
class FloatPaneManager {
  constructor() {
    this.floatPanes = [];
  }
  
  add(floatPane) {
    this.floatPanes.push(floatPane);
  }

  remove(id) {
    const index = this.floatPanes.findIndex(fp => fp.id === id);
    
    if (index !== -1) {
      const [removed] = this.floatPanes.splice(index, 1);
      return removed;
    }
    
    return null;
  }
}

export const floatPaneManager = new FloatPaneManager();