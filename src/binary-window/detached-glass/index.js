import addModule from './add';
import activateModule from './activate';
import moveModule from './move';
import dragModule from './drag';
import resizeModule from './resize';
import restoreModule from './restore';
import closeAction from './action.close';
import minimizeAction from './action.minimize';

export { DetachedGlass } from './class';

export const BUILTIN_ACTIONS_2 = [minimizeAction, closeAction];

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

  ...addModule,
  ...activateModule,
  ...moveModule,
  ...dragModule,
  ...resizeModule,
  ...restoreModule,
};
