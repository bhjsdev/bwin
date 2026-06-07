import { default as addModule } from './add';
import { default as activateModule } from './activate';
import { default as moveModule } from './move';
import { default as dragModule } from './drag';
import { default as resizeModule } from './resize';
import { default as restoreModule } from './restore';
import { closeAction } from './close';
import { minimizeAction } from './minimize';

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
