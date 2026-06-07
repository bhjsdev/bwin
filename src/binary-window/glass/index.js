import { default as actionModule } from './action';
import { default as dragModule } from './drag';
import closeAction from './action.close';
import minimizeAction from './action.minimize';
import maximizeAction from './action.maximize';
import detachAction from './action.detach';

export { Glass } from './class';

export const BUILTIN_ACTIONS = [minimizeAction, detachAction, maximizeAction, closeAction];

export default {
  enableGlassFeature() {
    this.enableGlassActions();
    this.enableGlassDrag();
  },

  ...actionModule,
  ...dragModule,
};
