import { genColor, genId, moveChildNodes } from './utils.js';
import { debug, addPaneByPosition } from './frame.helpers.js';
import { SashConfig } from './sash-config.js';
import { ConfigRoot } from './config-root.js';
import { frameFeatures } from './frame.features.js';

/**
 * @think-about:
 *   1. if we need to immediately update the frame size
 *      when `fitContainer` is set true or false
 *   2. add a `fit` method to fit the frame to the container
 */
export class Frame {
  muntinSize = 5;
  windowEl = null;
  containerEl = null;

  constructor(containerEl, settings) {
    Object.assign(this, frameFeatures);

    this.containerEl = containerEl;

    let config = null;

    if (settings instanceof SashConfig) {
      config = settings;
      this.rootSash = settings;
    }
    else {
      config = new ConfigRoot(settings);
      this.rootSash = config.buildSashTree();
    }

    this.droppable = config.droppable;
    this.fitContainer = config.fitContainer;
    this.minPaneSize = config.minPaneSize;
    this.maxPaneSize = config.maxPaneSize;
    this.resizable = config.resizable;

    this.droppable && this.enableDrop();
    this.fitContainer && this.enableFitContainer();
    this.resizable && this.enableResize();

    this.debug = true;
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
    const muntinEl = sash.domNode;
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
    const paneEl = sash.domNode;
    paneEl.style.top = `${sash.top}px`;
    paneEl.style.left = `${sash.left}px`;
    paneEl.style.width = `${sash.width}px`;
    paneEl.style.height = `${sash.height}px`;

    if (this.debug) {
      const paneEl = sash.domNode;
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

    parentSash.domNode = siblingSash.domNode;
    // Remove all children, so it becomes a pane
    parentSash.children = [];
    // The muntin of old ID will be removed in `this.update`
    parentSash.id = genId();

    this.update();
  }

  updateWindow(sash) {
    const windowEl = sash.domNode;
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

      sash.domNode = elem;
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
          sash.domNode = muntinEl;
        }
        else {
          this.updateMuntin(sash);
        }
      }
      else {
        if (!allSashIdsInWindow.includes(sash.id)) {
          const paneEl = sash.domNode ? this.createPane(sash, sash.domNode) : this.createPane(sash);

          sash.domNode = paneEl;
          this.windowEl.prepend(sash.domNode);
        }
        else {
          this.updatePane(sash);
        }
      }
    });
  }
}
