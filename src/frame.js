import { SashConfig } from './sash-config';
import { ConfigRoot } from './config-root';
import { strictAssign } from './utils';

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

const modulePaths = [
  './frame.main.js',
  './frame.muntin.js',
  './frame.pane.js',
  './frame.fit-container.js',
  './frame.resizable.js',
  './frame.droppable.js',
];

for (const path of modulePaths) {
  strictAssign(
    Frame.prototype,
    await import(/* @vite-ignore */ path).then((module) => module.default)
  );
}
