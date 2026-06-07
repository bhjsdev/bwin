import { default as actionModule } from './action';
import { default as dragModule } from './drag';
import closeAction from './close';
import minimizeAction from './minimize';
import maximizeAction from './maximize';

export { Glass } from './class';

export const BUILTIN_ACTIONS = [minimizeAction, maximizeAction, closeAction];

export default {
  enableGlassFeature() {
    this.enableGlassActions();
    this.enableGlassDrag();
  },

  ...actionModule,
  ...dragModule,
};
