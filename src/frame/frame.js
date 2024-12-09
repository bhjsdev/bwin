import { SashConfig } from '../config/sash-config';
import { ConfigRoot } from '../config/config-root';
import { strictAssign } from '../utils';
import paneModule from './pane';
import mainModule from './main';
import muntinModule from './muntin';
import fitContainerModule from './fit-container';
import resizableModule from './resizable';
import droppableModule from './droppable';

const DEBUG = import.meta.env.VITE_DEBUG == 'true' ? true : false;

/**
 * @think-about:
 *   1. if we need to immediately update the frame size
 *      when `fitContainer` is set true or false
 *   2. add a `fit` method to fit the frame to the container
 *
 */
export class Frame {
  windowElement = null;
  containerElement = null;
  debug = DEBUG;

  constructor(settings) {
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
  }

  frame(containerEl) {
    this.containerElement = containerEl;

    this.windowElement = this.createWindow();
    this.glaze();
    this.containerElement.append(this.windowElement);
  }

  // Features can work independently to each other
  enableFeatures() {
    this.enableResize();
    this.enableDrop();
    this.fitContainer && this.enableFitContainer();
  }

  mount(containerEl) {
    this.frame(containerEl);
    this.enableFeatures();
  }

  static assemble(...modules) {
    modules.forEach((module) => {
      strictAssign(this.prototype, module);
    });
  }
}

Frame.assemble(
  mainModule,
  muntinModule,
  paneModule,
  fitContainerModule,
  droppableModule,
  resizableModule
);
