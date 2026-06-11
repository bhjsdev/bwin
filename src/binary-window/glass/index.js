import actionModule from './action';
import dragModule from './drag';
import closeAction from './action.close';
import minimizeAction from './action.minimize';
import maximizeAction from './action.maximize';
import detachAction from './action.detach';

export { Glass, DEFAULT_GLASS_ACTIONS } from './glass';

// @deprecated - use DEFAULT_GLASS_ACTIONS instead
export const BUILTIN_ACTIONS = [minimizeAction, maximizeAction, detachAction, closeAction];

export default {
  enableGlassFeature() {
    this.enableGlassActions();
    this.enableGlassDrag();
  },

  ...actionModule,
  ...dragModule,
};
