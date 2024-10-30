import { genColor, genId, moveChildNodes } from './utils.js';
import { debug, addPaneByPosition } from './frame.helpers.js';

const DEFAULTS = {
  resizable: true,
  fitContainer: false,
  minPaneSize: 20,
  maxPaneSize: Infinity,
};

export class Frame {
  muntinSize = 5;
  isResizeStarted = false;
  lastX = 0;
  lastY = 0;
  bodyUserSelect = '';
  activeMuntin = null;
  windowEl = null;

  constructor(
    containerEl,
    rootSash,
    {
      resizable = DEFAULTS.resizable,
      fitContainer = DEFAULTS.fitContainer,
      minPaneSize = DEFAULTS.minPaneSize,
      maxPaneSize = DEFAULTS.maxPaneSize,
      debug = true,
    } = DEFAULTS
  ) {
    this.containerEl = containerEl;
    this.rootSash = rootSash;
    this.minPaneSize = minPaneSize;
    this.maxPaneSize = maxPaneSize;

    resizable && this.enableResize();
    fitContainer && this.enableFitContainer();

    this.debug = debug;
  }

  applyResizeStyles() {
    if (this.activeMuntin.element.hasAttribute('vertical')) {
      document.body.classList.add('body--bw-resize-x');
    }
    else if (this.activeMuntin.element.hasAttribute('horizontal')) {
      document.body.classList.add('body--bw-resize-y');
    }
  }

  revertResizeStyles() {
    document.body.classList.remove('body--bw-resize-x');
    document.body.classList.remove('body--bw-resize-y');
  }

  enableFitContainer() {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.containerEl) {
          this.rootSash.width = entry.contentRect.width;
          this.rootSash.height = entry.contentRect.height;

          this.update();
        }
      }
    });

    resizeObserver.observe(this.containerEl);
  }

  enableResize() {
    document.body.addEventListener('mousedown', (event) => {
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
      this.isResizeStarted = false;
      this.activeMuntin = null;

      this.revertResizeStyles();
    });
  }

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
  }

  updateMuntin(sash) {
    const muntinEl = sash.element;
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
  }

  createPane(sash, fromPaneEl) {
    const paneEl = document.createElement('bw-pane');
    paneEl.style.top = `${sash.top}px`;
    paneEl.style.left = `${sash.left}px`;
    paneEl.style.width = `${sash.width}px`;
    paneEl.style.height = `${sash.height}px`;

    paneEl.setAttribute('sash-id', sash.id);
    paneEl.setAttribute('position', sash.position);

    // Create the pane with the content of fromPaneEl
    if (fromPaneEl) {
      moveChildNodes(paneEl, fromPaneEl);
    }

    if (this.debug) {
      paneEl.style.backgroundColor = genColor();
      paneEl.append(debug(paneEl));
    }

    return paneEl;
  }

  updatePane(sash) {
    const paneEl = sash.element;
    paneEl.style.top = `${sash.top}px`;
    paneEl.style.left = `${sash.left}px`;
    paneEl.style.width = `${sash.width}px`;
    paneEl.style.height = `${sash.height}px`;

    if (this.debug) {
      const paneEl = sash.element;
      paneEl.innerHTML = '';
      paneEl.append(debug(paneEl));
    }
  }

  addPane(parentSashId, position) {
    const parentSash = this.rootSash.getById(parentSashId);

    if (!parentSash) throw new Error('[bwin] Parent pane not found');
    if (!position) throw new Error('[bwin] Position is required');

    addPaneByPosition(parentSash, position);
    // Generate new ID for parent sash to create a new muntin
    parentSash.id = genId();

    this.update();
  }

  removePane(sashId) {
    const parentSash = this.rootSash.getDescendantParentById(sashId);
    const siblingSash = parentSash.getChildSiblingById(sashId);

    parentSash.element = siblingSash.element;
    // Remove all children, so it becomes a pane
    parentSash.children = [];
    // The muntin of old ID will be removed in `this.update`
    parentSash.id = genId();

    this.update();
  }

  updateWindow(sash) {
    const windowEl = sash.element;
    windowEl.style.width = `${sash.width}px`;
    windowEl.style.height = `${sash.height}px`;
  }

  create() {
    const windowEl = document.createElement('bw-window');
    windowEl.style.width = `${this.rootSash.width}px`;
    windowEl.style.height = `${this.rootSash.height}px`;
    windowEl.setAttribute('sash-id', this.rootSash.id);

    this.rootSash.walk((sash) => {
      let elem = null;

      // Prepend the new pane, so muntins are always on top
      if (sash.children.length > 0) {
        elem = this.createMuntin(sash);
        windowEl.append(elem);
      }
      else {
        elem = this.createPane(sash);
        windowEl.prepend(elem);
      }

      sash.element = elem;
    });

    this.containerEl.append(windowEl);
    this.windowEl = windowEl;
  }

  update() {
    this.windowEl.style.width = `${this.rootSash.width}px`;
    this.windowEl.style.height = `${this.rootSash.height}px`;

    const allSashIdsFromRoot = this.rootSash.getAllIds();

    let allSashIdsInWindow = [];
    this.windowEl.querySelectorAll('[sash-id]').forEach((el) => {
      const sashId = el.getAttribute('sash-id');
      allSashIdsInWindow.push(sashId);

      if (!allSashIdsFromRoot.includes(sashId)) {
        el.remove();
      }
    });

    this.rootSash.walk((sash) => {
      if (sash.children.length > 0) {
        if (!allSashIdsInWindow.includes(sash.id)) {
          const muntinEl = this.createMuntin(sash);
          this.windowEl.append(muntinEl);
          sash.element = muntinEl;
        }
        else {
          this.updateMuntin(sash);
        }
      }
      else {
        if (!allSashIdsInWindow.includes(sash.id)) {
          const paneEl = sash.element ? this.createPane(sash, sash.element) : this.createPane(sash);

          sash.element = paneEl;
          this.windowEl.prepend(sash.element);
        }
        else {
          this.updatePane(sash);
        }
      }
    });
  }
}
