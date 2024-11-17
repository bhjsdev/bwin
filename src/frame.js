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

    this.fitContainer = config.fitContainer;
    this.droppable = config.droppable;
    this.onDrop = config.onDrop;

    // Features. Can work independently
    this.enableResize();
    this.fitContainer && this.enableFitContainer();
    this.droppable && this.enableDrop();
  }

  static assemble(...modules) {
    modules.forEach((module) => {
      strictAssign(Frame.prototype, module);
    });
  }
}

Frame.assemble(
  frameMain,
  frameMuntin,
  framePane,
  frameFitContainer,
  frameDroppable,
  frameResizable
);
