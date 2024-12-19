export default {
  activeMuntinSash: null,
  isResizeStarted: false,
  isDropStarted: false,
  lastX: 0,
  lastY: 0,

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
      if (event.target.tagName !== 'BW-MUNTIN') return;
      if (event.target.getAttribute('resizable') === 'false') return;

      const sashId = event.target.getAttribute('sash-id');
      this.activeMuntinSash = this.rootSash.getById(sashId);

      if (!this.activeMuntinSash) return;

      this.isResizeStarted = true;
      this.lastX = event.pageX;
      this.lastY = event.pageY;

      this.applyResizeStyles();
    });

    document.addEventListener('mousemove', (event) => {
      if (!this.isResizeStarted || !this.activeMuntinSash) return;

      const [topChild, rightChild, bottomChild, leftChild] = this.activeMuntinSash.getChildren();

      const isVerticalMuntin = this.activeMuntinSash.isLeftRightSplit();
      const isHorizontalMuntin = this.activeMuntinSash.isTopBottomSplit();

      if (isVerticalMuntin && leftChild && rightChild) {
        const distX = event.pageX - this.lastX;

        const newLeftChildWidth = leftChild.width + distX;
        const newRightChildWidth = rightChild.width - distX;

        if (distX > 0 && newRightChildWidth <= rightChild.calcMinWidth()) return;
        if (distX < 0 && newLeftChildWidth <= leftChild.calcMinWidth()) return;

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

        if (distY > 0 && newBottomChildHeight <= bottomChild.calcMinHeight()) return;
        if (distY < 0 && newTopChildHeight <= topChild.calcMinHeight()) return;

        topChild.height = newTopChildHeight;
        bottomChild.height = newBottomChildHeight;
        bottomChild.top = bottomChild.top + distY;

        this.update();
        this.lastY = event.pageY;
      }
    });

    document.addEventListener('mouseup', () => {
      this.isResizeStarted = false;
      this.activeMuntinSash = null;
      this.revertResizeStyles();
    });
  },
};
