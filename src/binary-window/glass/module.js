import { default as actionModule } from './action';
import { default as dragModule } from './drag';

export default {
  enableGlassFeature() {
    this.enableGlassActions();
    this.enableGlassDrag();
  },

  ...actionModule,
  ...dragModule,
};
