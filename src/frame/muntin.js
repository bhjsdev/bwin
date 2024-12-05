export default {
  muntinSize: 4,

  createMuntin(sash) {
    const muntinEl = document.createElement('bw-muntin');

    const leftChild = sash.leftChild;
    const topChild = sash.topChild;

    if (leftChild) {
      muntinEl.style.width = `${this.muntinSize}px`;
      muntinEl.style.height = `${sash.height}px`;
      muntinEl.style.top = `${sash.top}px`;
      muntinEl.style.left = `${sash.left + leftChild.width - this.muntinSize / 2}px`;
      muntinEl.setAttribute('vertical', '');
    }
    else if (topChild) {
      muntinEl.style.width = `${sash.width}px`;
      muntinEl.style.height = `${this.muntinSize}px`;
      muntinEl.style.top = `${sash.top + topChild.height - this.muntinSize / 2}px`;
      muntinEl.style.left = `${sash.left}px`;
      muntinEl.setAttribute('horizontal', '');
    }

    muntinEl.setAttribute('sash-id', sash.id);

    sash.store.resizable === false && muntinEl.setAttribute('resizable', 'false');

    return muntinEl;
  },

  onMuntinCreate(muntinEl, sash) {
    // For overriding
  },

  updateMuntin(sash) {
    const muntinEl = sash.domNode;
    const leftChild = sash.leftChild;
    const topChild = sash.topChild;

    if (leftChild) {
      muntinEl.style.height = `${sash.height}px`;
      muntinEl.style.top = `${sash.top}px`;
      muntinEl.style.left = `${sash.left + leftChild.width - this.muntinSize / 2}px`;
    }
    else if (topChild) {
      muntinEl.style.width = `${sash.width}px`;
      muntinEl.style.top = `${sash.top + topChild.height - this.muntinSize / 2}px`;
      muntinEl.style.left = `${sash.left}px`;
    }
  },

  onMuntinUpdate(muntinEl, sash) {
    // For overriding
  },
};
