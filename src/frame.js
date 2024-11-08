import { SashConfig } from './sash-config.js';
import { ConfigRoot } from './config-root.js';
import { frameFeatures } from './frame.features.js';
import { framePane } from './frame.pane.js';
import { frameMuntin } from './frame.muntin.js';

/**
 * @think-about:
 *   1. if we need to immediately update the frame size
 *      when `fitContainer` is set true or false
 *   2. add a `fit` method to fit the frame to the container
 */
export class Frame {
  windowEl = null;
  containerEl = null;
  debug = true;

  constructor(containerEl, settings) {
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
    this.resizable = config.resizable;
    this.minPaneSize = config.minPaneSize;
    this.maxPaneSize = config.maxPaneSize;

    this.initFeatures();
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
    const allSashIdsInWindow = [];

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
          // Create a new pane with the content of the old pane if it exists
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

Object.assign(Frame.prototype, frameMuntin);
Object.assign(Frame.prototype, framePane);
Object.assign(Frame.prototype, frameFeatures);
