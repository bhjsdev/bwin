import { DetachedGlass } from './class';
import { detachedGlassManager } from './manager';

export default {
  addDetachedGlass(options = {}) {
    const glass = new DetachedGlass(options);
    this.windowElement.append(glass.domNode);
    detachedGlassManager.add(glass.domNode);

    return glass;
  },
};
