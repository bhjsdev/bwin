export default {
  activeMuntinSash: null,
  isResizeStarted: false,
  isDropStarted: false,
  lastX: 0,
  lastY: 0,

  enableResize() {
    // Delegated on `windowElement` (not `document`) so the listeners die with the
    // element — `document` listeners outlive a rebuilt window, leak the dead Frame
    // via their closures, and race the live instance on a shared muntin pointerdown.
    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.target.tagName !== 'BW-MUNTIN') return;
      if (event.target.getAttribute('resizable') === 'false') return;

      // Make the cursor style persist even if the pointer leaves muntin or screen during drag
      event.target.setPointerCapture(event.pointerId);

      const sashId = event.target.getAttribute('sash-id');
      this.activeMuntinSash = this.rootSash.getById(sashId);

      if (!this.activeMuntinSash) return;

      this.isResizeStarted = true;
      this.lastX = event.pageX;
      this.lastY = event.pageY;
    });

    this.windowElement.addEventListener('pointermove', (event) => {
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

        this.reglaze();
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

        this.reglaze();
        this.lastY = event.pageY;
      }
    });

    this.windowElement.addEventListener('pointerup', (event) => {
      this.isResizeStarted = false;
      this.activeMuntinSash = null;

      event.target.releasePointerCapture(event.pointerId);
    });
  },
};
