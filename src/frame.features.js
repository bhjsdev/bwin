export const frameFeatures = {
  activeMuntinSash: null,
  isResizeStarted: false,
  isDropStarted: false,
  lastX: 0,
  lastY: 0,
  minPaneSize: 0,
  fitContainer: false,
  resizable: true,
  droppable: true,

  initFeatures() {
    this.droppable && this.enableDrop();
    this.fitContainer && this.enableFitContainer();
    this.resizable && this.enableResize();
  },

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
    if (this.activeMuntinSash.domNode.hasAttribute('vertical')) {
      document.body.classList.add('body--bw-resize-x');
    }
    else if (this.activeMuntinSash.domNode.hasAttribute('horizontal')) {
      document.body.classList.add('body--bw-resize-y');
    }
  },

  revertResizeStyles() {
    document.body.classList.remove('body--bw-resize-x');
    document.body.classList.remove('body--bw-resize-y');
  },

  enableResize() {
    document.addEventListener('mousedown', (event) => {
      if (!this.resizable) return;
      if (event.target.tagName !== 'BW-MUNTIN') return;

      const sashId = event.target.getAttribute('sash-id');
      this.activeMuntinSash = this.rootSash.getById(sashId);

      if (!this.activeMuntinSash) return;

      this.isResizeStarted = true;
      this.lastX = event.pageX;
      this.lastY = event.pageY;

      this.applyResizeStyles();
    });

    document.addEventListener('mousemove', (event) => {
      if (!this.resizable) return;
      if (!this.isResizeStarted || !this.activeMuntinSash) return;

      const [topChild, rightChild, bottomChild, leftChild] = this.activeMuntinSash.getChildren();

      const isVerticalMuntin = this.activeMuntinSash.isLeftRightSplit();
      const isHorizontalMuntin = this.activeMuntinSash.isTopBottomSplit();

      if (isVerticalMuntin && leftChild && rightChild) {
        const distX = event.pageX - this.lastX;

        const newLeftChildWidth = leftChild.width + distX;
        const newRightChildWidth = rightChild.width - distX;

        if (
          newLeftChildWidth <= leftChild.calcMinWidth() ||
          newRightChildWidth <= rightChild.calcMinWidth()
        ) {
          return;
        }

        leftChild.width = newLeftChildWidth;
        rightChild.width = newRightChildWidth;
        rightChild.left = rightChild.left + distX;

        this.update();
        this.lastX = event.pageX;
      }
      else if (isHorizontalMuntin && topChild && bottomChild) {
        const distY = event.pageY - this.lastY;

        const newTopChildHeight = topChild.height + distY;
        const newBottomChildHeight = bottomChild.height - distY;

        if (
          newTopChildHeight <= topChild.calcMinHeight() ||
          newBottomChildHeight <= bottomChild.calcMinHeight()
        ) {
          return;
        }

        topChild.height = newTopChildHeight;
        bottomChild.height = newBottomChildHeight;
        bottomChild.top = bottomChild.top + distY;

        this.update();
        this.lastY = event.pageY;
      }
    });

    document.addEventListener('mouseup', () => {
      if (!this.resizable) return;

      this.isResizeStarted = false;
      this.activeMuntinSash = null;
      this.revertResizeStyles();
    });
  },
};
