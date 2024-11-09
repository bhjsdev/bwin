import { SashConfig } from './sash-config.js';
import { ConfigRoot } from './config-root.js';
import { frameFeatures } from './frame.features.js';
import { framePane } from './frame.pane.js';
import { frameMuntin } from './frame.muntin.js';
import { strictAssign } from './utils.js';

/**
 * @think-about:
 *   1. if we need to immediately update the frame size
 *      when `fitContainer` is set true or false
 *   2. add a `fit` method to fit the frame to the container
 *
 * @todo:
 *   - Assign `minPaneSize` to Sash's minWidth and minHeight
 */
export class Frame {
  windowEl = null;
  containerEl = null;

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
          sash.domNode = this.createMuntin(sash);
          this.windowEl.append(sash.domNode);
        }
        else {
          this.updateMuntin(sash);
        }
      }
      else {
        if (!allSashIdsInWindow.includes(sash.id)) {
          if (!sash.domNode) {
            sash.domNode = this.createPane(sash);
          }

          this.windowEl.prepend(sash.domNode);
        }
        else {
          this.updatePane(sash);
        }
      }
    });
  }
}

strictAssign(Frame.prototype, frameMuntin);
strictAssign(Frame.prototype, framePane);
strictAssign(Frame.prototype, frameFeatures);
