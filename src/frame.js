import { genColor } from './utils.js';

const DEBUG = true;

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
    } = DEFAULTS
  ) {
    this.containerEl = containerEl;
    this.rootSash = rootSash;
    this.minPaneSize = minPaneSize;
    this.maxPaneSize = maxPaneSize;

    resizable && this.enableResize();
    fitContainer && this.enableFitContainer();
  }

  applyResizeStyles() {
    if (this.activeMuntin.element.hasAttribute('vertical')) {
      document.body.classList.add('body--bw-resize-col');
    }
    else if (this.activeMuntin.element.hasAttribute('horizontal')) {
      document.body.classList.add('body--bw-resize-row');
    }
  }

  revertResizeStyles() {
    document.body.classList.remove('body--bw-resize-row');
    document.body.classList.remove('body--bw-resize-col');
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

  createPane(sash) {
    const paneEl = document.createElement('bw-pane');
    paneEl.style.top = `${sash.top}px`;
    paneEl.style.left = `${sash.left}px`;
    paneEl.style.width = `${sash.width}px`;
    paneEl.style.height = `${sash.height}px`;
    paneEl.setAttribute('sash-id', sash.id);
    paneEl.setAttribute('position', sash.position.description);

    if (DEBUG) {
      paneEl.style.backgroundColor = genColor();
      paneEl.appendChild(debug(paneEl));
    }

    return paneEl;
  }

  updatePane(sash) {
    const paneEl = sash.element;
    paneEl.style.top = `${sash.top}px`;
    paneEl.style.left = `${sash.left}px`;
    paneEl.style.width = `${sash.width}px`;
    paneEl.style.height = `${sash.height}px`;

    if (DEBUG) {
      const paneEl = sash.element;
      paneEl.innerHTML = '';
      paneEl.appendChild(debug(paneEl));
    }
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

      if (sash.children.length > 0) {
        elem = this.createMuntin(sash);
      }
      else {
        elem = this.createPane(sash);
      }

      windowEl.appendChild(elem);

      sash.element = elem;
    });

    this.containerEl.appendChild(windowEl);
    this.windowEl = windowEl;
  }

  update() {
    this.windowEl.style.width = `${this.rootSash.width}px`;
    this.windowEl.style.height = `${this.rootSash.height}px`;

    this.rootSash.walk((sash) => {
      if (sash.children.length > 0) {
        this.updateMuntin(sash);
      }
      else {
        this.updatePane(sash);
      }
    });
  }
}

export function debug(parentEl) {
  const debugEl = document.createElement('pre');
  debugEl.style.fontSize = '9px';

  const debugHtml = `
top: ${parentEl.style.top}
left: ${parentEl.style.left}
width: ${parentEl.style.width}
height: ${parentEl.style.height}
id: ${parentEl.getAttribute('sash-id')}
position: ${parentEl.getAttribute('position')}
`;

  debugEl.innerHTML = debugHtml.trim();
  return debugEl;
}
