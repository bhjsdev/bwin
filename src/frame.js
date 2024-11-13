import { SashConfig } from './sash-config';
import { ConfigRoot } from './config-root';
import { strictAssign } from './utils';
import framePane from './frame.pane';
import frameMain from './frame.main';
import frameMuntin from './frame.muntin';
import frameFitContainer from './frame.fit-container';
import frameResizable from './frame.resizable';
import frameDroppable from './frame.droppable';

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
strictAssign(Frame.prototype, frameFitContainer);
strictAssign(Frame.prototype, frameResizable);
strictAssign(Frame.prototype, frameDroppable);
