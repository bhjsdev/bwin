import crudModule from './crud';
import activateModule from './activate';
import moveModule from './move';
import resizeModule from './resize';
import restoreModule from './restore';

export {
  DetachedGlass,
  DEFAULT_DETACHED_GLASS_ACTIONS,
  DEFAULT_WINDOWLESS_GLASS_ACTIONS,
} from './detached-glass';

export default {
  enableDetachedGlassFeatures() {
    restoreModule.enableRestoreFromMinimizedDetachedGlass.call(this);
  },

  enableDetachedGlassStandaloneFeatures() {
    activateModule.enableDetachedGlassActivate();
    moveModule.enableDetachedGlassMove();
    resizeModule.enableDetachedGlassResize();
  },

  ...crudModule,
};
