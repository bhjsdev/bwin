import { default as addModule } from './add';
import { default as activateModule } from './activate';
import { default as moveModule } from './move';
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
    this.enableDetachedGlassMove();
    this.handleMinimizedDetachedGlassClick();
  },

  ...addModule,
  ...activateModule,
  ...moveModule,
  ...resizeModule,
  ...restoreModule,
};
