export default {
  trimMuntin(muntinEl) {
    if (muntinEl.hasAttribute('vertical')) {
      muntinEl.style.top = `${parseFloat(muntinEl.style.top) + this.muntinSize / 2}px`;
      muntinEl.style.height = `${parseFloat(muntinEl.style.height) - this.muntinSize}px`;
    }
    else if (muntinEl.hasAttribute('horizontal')) {
      muntinEl.style.left = `${parseFloat(muntinEl.style.left) + this.muntinSize / 2}px`;
      muntinEl.style.width = `${parseFloat(muntinEl.style.width) - this.muntinSize}px`;
    }
  },

  onMuntinCreate(muntinEl) {
    this.trimMuntin(muntinEl);
  },

  onMuntinUpdate(muntinEl) {
    this.trimMuntin(muntinEl);
  },
};
