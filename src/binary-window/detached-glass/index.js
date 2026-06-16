import crudModule from './crud';
import activateModule from './activate';
import moveModule from './move';
import dragModule from './drag';
import resizeModule from './resize';
import restoreModule from './restore';

export {
  DetachedGlass,
  DEFAULT_DETACHED_GLASS_ACTIONS,
  DEFAULT_FREE_GLASS_ACTIONS,
} from './detached-glass';

export default {
  enableDetachedGlassFeatures() {
    this.enableDetachedGlassActivate();
    this.enableDetachedGlassResize();
    // Repositioning: toggle between drag (native, docks to panes) and move
    // (pointer-based, free-floating only). Enable exactly one.
    // this.enableDetachedGlassDrag();
    this.enableDetachedGlassMove();
    this.handleMinimizedDetachedGlassClick();
  },

  ...crudModule,
  ...activateModule,
  ...moveModule,
  ...dragModule,
  ...resizeModule,
  ...restoreModule,
};
