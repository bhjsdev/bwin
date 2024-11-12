import { SashConfig } from './sash-config.js';
import { ConfigRoot } from './config-root.js';
import frameMain from './frame.main.js';
import frameMuntin from './frame.muntin.js';
import framePane from './frame.pane.js';
import frameFitContainer from './frame.fit-container.js';
import frameResizable from './frame.resizable.js';
import frameDroppable from './frame.droppable.js';
import { strictAssign } from './utils.js';

/**
 * @think-about:
 *   1. if we need to immediately update the frame size
 *      when `fitContainer` is set true or false
 *   2. add a `fit` method to fit the frame to the container
 *
 */
export class Frame {
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

    this.resizable = config.resizable;
    this.fitContainer = config.fitContainer;
    this.droppable = config.droppable;

    // Features. Can work independently
    this.resizable && this.enableResize();
    this.fitContainer && this.enableFitContainer();
    this.droppable && this.enableDrop();
  }
}

strictAssign(Frame.prototype, frameMain);
strictAssign(Frame.prototype, frameMuntin);
strictAssign(Frame.prototype, framePane);
strictAssign(Frame.prototype, frameResizable);
strictAssign(Frame.prototype, frameFitContainer);
strictAssign(Frame.prototype, frameDroppable);
