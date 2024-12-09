export default {
  fitContainer: false,

  fit() {
    this.rootSash.width = this.containerElement.clientWidth;
    this.rootSash.height = this.containerElement.clientHeight;

    this.update();
  },

  enableFitContainer() {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.containerElement && this.fitContainer) {
          this.fit();
        }
      }
    });

    resizeObserver.observe(this.containerElement);
  },
};
