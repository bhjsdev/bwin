export const frameMuntin = {
  muntinSize: 5,

  createMuntin(sash) {
    const muntinEl = document.createElement('bw-muntin');

    const sashLeftChild = sash.getLeftChild();
    const sashTopChild = sash.getTopChild();

    if (sashLeftChild) {
      muntinEl.style.width = `${this.muntinSize}px`;
      muntinEl.style.height = `${sash.height}px`;
      muntinEl.style.top = `${sash.top}px`;
      muntinEl.style.left = `${sash.left + sashLeftChild.width - this.muntinSize / 2}px`;
      muntinEl.setAttribute('vertical', '');
    }
    else if (sashTopChild) {
      muntinEl.style.width = `${sash.width}px`;
      muntinEl.style.height = `${this.muntinSize}px`;
      muntinEl.style.top = `${sash.top + sashTopChild.height - this.muntinSize / 2}px`;
      muntinEl.style.left = `${sash.left}px`;
      muntinEl.setAttribute('horizontal', '');
    }

    muntinEl.setAttribute('sash-id', sash.id);

    return muntinEl;
  },

  updateMuntin(sash) {
    const muntinEl = sash.domNode;
    const sashLeftChild = sash.getLeftChild();
    const sashTopChild = sash.getTopChild();

    if (sashLeftChild) {
      muntinEl.style.height = `${sash.height}px`;
      muntinEl.style.top = `${sash.top}px`;
      muntinEl.style.left = `${sash.left + sashLeftChild.width - this.muntinSize / 2}px`;
    }
    else if (sashTopChild) {
      muntinEl.style.width = `${sash.width}px`;
      muntinEl.style.top = `${sash.top + sashTopChild.height - this.muntinSize / 2}px`;
      muntinEl.style.left = `${sash.left}px`;
    }
  },
};
