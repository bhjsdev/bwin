export const frameFeatures = {
  activeMuntin: null,
  isResizeStarted: false,
  isDropStarted: false,
  lastX: 0,
  lastY: 0,
  minPaneSize: 0,
  maxPaneSize: Infinity,
  fitContainer: false,
  resizable: true,
  droppable: true,

  enableDrop() {},

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

  applyResizeStyles() {
    if (this.activeMuntin.domNode.hasAttribute('vertical')) {
      document.body.classList.add('body--bw-resize-x');
    }
    else if (this.activeMuntin.domNode.hasAttribute('horizontal')) {
      document.body.classList.add('body--bw-resize-y');
    }
  },

  revertResizeStyles() {
    document.body.classList.remove('body--bw-resize-x');
    document.body.classList.remove('body--bw-resize-y');
  },

  enableResize() {
    document.body.addEventListener('mousedown', (event) => {
      if (!this.resizable) return;
      if (event.target.tagName !== 'BW-MUNTIN') return;

      const sashId = event.target.getAttribute('sash-id');
      this.activeMuntin = this.rootSash.getById(sashId);

      if (!this.activeMuntin) return;

      this.isResizeStarted = true;
      this.lastX = event.pageX;
      this.lastY = event.pageY;

      this.applyResizeStyles();
    });

    document.body.addEventListener('mousemove', (event) => {
      if (!this.resizable) return;
      if (!this.isResizeStarted || !this.activeMuntin) return;

      const leftChild = this.activeMuntin.getLeftChild();
      const rightChild = this.activeMuntin.getRightChild();
      const topChild = this.activeMuntin.getTopChild();
      const bottomChild = this.activeMuntin.getBottomChild();

      const isVerticalMuntin = this.activeMuntin.isVertSplit();
      const isHorizontalMuntin = this.activeMuntin.isHorzSplit();

      if (isVerticalMuntin && leftChild && rightChild) {
        const distX = event.pageX - this.lastX;

        const newLeftChildWidth = leftChild.width + distX;
        const newRightChildWidth = rightChild.width - distX;

        if (
          (newLeftChildWidth > this.minPaneSize || newLeftChildWidth === this.minPaneSize) &&
          (newRightChildWidth > this.minPaneSize || newRightChildWidth === this.minPaneSize) &&
          (newLeftChildWidth < this.maxPaneSize || newLeftChildWidth === this.maxPaneSize) &&
          (newRightChildWidth < this.maxPaneSize || newRightChildWidth === this.maxPaneSize)
        ) {
          leftChild.width = newLeftChildWidth;
          rightChild.width = newRightChildWidth;
          rightChild.left = rightChild.left + distX;

          this.update();
          this.lastX = event.pageX;
        }
      }
      else if (isHorizontalMuntin && topChild && bottomChild) {
        const distY = event.pageY - this.lastY;

        const newTopChildHeight = topChild.height + distY;
        const newBottomChildHeight = bottomChild.height - distY;

        if (
          (newTopChildHeight > this.minPaneSize || newTopChildHeight === this.minPaneSize) &&
          (newBottomChildHeight > this.minPaneSize || newBottomChildHeight === this.minPaneSize) &&
          (newTopChildHeight < this.maxPaneSize || newTopChildHeight === this.maxPaneSize) &&
          (newBottomChildHeight < this.maxPaneSize || newBottomChildHeight === this.maxPaneSize)
        ) {
          topChild.height += distY;
          bottomChild.height -= distY;
          bottomChild.top += distY;

          this.update();
          this.lastY = event.pageY;
        }
      }
    });

    document.body.addEventListener('mouseup', () => {
      if (!this.resizable) return;

      this.isResizeStarted = false;
      this.activeMuntin = null;
      this.revertResizeStyles();
    });
  },
};
