import crudModule from './crud';
import activateModule from './activate';
import moveModule from './move';
import resizeModule from './resize';

export {
  DetachedGlass,
  DEFAULT_DETACHED_GLASS_ACTIONS,
  DEFAULT_WINDOWLESS_GLASS_ACTIONS,
} from './detached-glass';

export default {
  // So each binary window instance can have its own detached glass stack
  detachedGlassManager: null,

  enableDetachedGlassFeatures() {
    this.enableDetachedGlassActivate();
    this.renderDetachedGlasses();
  },

  enableDetachedGlassStandaloneFeatures() {
    moveModule.enableDetachedGlassMove();
    resizeModule.enableDetachedGlassResize();
  },

  ...crudModule,
  ...activateModule,
};
