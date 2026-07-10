import { ConfigRoot } from '../config/config-root';
import { strictAssign } from '../utils';
import { Sash } from '../sash';
import paneModule from './pane';
import renderModule from './render';
import muntinModule from './muntin';
import fitContainerModule from './fit-container';
import resizableModule from './resizable';
import droppableModule from './droppable';
import eventModule from './event';

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
    this.setup(settings);
  }

  setup(settings) {
    if (settings instanceof Sash) {
      this.rootSash = settings;
      this.fitContainer = settings.fitContainer;
      return;
    }

    const config = new ConfigRoot(settings);
    this.rootSash = config.buildSashTree({ resizeStrategy: config.resizeStrategy });
    this.fitContainer = config.fitContainer;
  }

  frame(containerEl) {
    this.containerElement = containerEl;
    this.windowElement = this.createWindow();
    this.glaze();
    this.containerElement.append(this.windowElement);
  }

  reframe(settings) {
    this.deglaze();
    this.setup(settings);
    this.glaze();
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

  static assembleStatic(...modules) {
    modules.forEach((module) => {
      strictAssign(this, module);
    });
  }
}

Frame.assemble(
  renderModule,
  muntinModule,
  paneModule,
  fitContainerModule,
  droppableModule,
  resizableModule,
  eventModule
);
