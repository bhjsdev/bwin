export default {
  fitContainer: false,

  enableFitContainer() {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.containerEl && this.fitContainer) {
          this.rootSash.width = entry.contentRect.width;
          this.rootSash.height = entry.contentRect.height;

          this.update();
        }
      }
    });

    resizeObserver.observe(this.containerEl);
  },
};
