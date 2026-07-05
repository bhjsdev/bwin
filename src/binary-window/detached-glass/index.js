import crudModule from './crud';
import activateModule from './activate';
import moveModule from './move';
import resizeModule from './resize';
// import moveModule from './move-new';

export {
  DetachedGlass,
  DEFAULT_DETACHED_GLASS_ACTIONS,
  DEFAULT_WINDOWLESS_GLASS_ACTIONS,
} from './detached-glass';

export default {
  enableDetachedGlassStandaloneFeatures() {
    activateModule.enableDetachedGlassActivate();
    moveModule.enableDetachedGlassMove();
    resizeModule.enableDetachedGlassResize();
  },

  ...crudModule,
};
