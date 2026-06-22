import { DetachedGlass } from './detached-glass';
import { detachedGlassManager } from './manager';
import { animateDetachedGlassOpen, removeDetachedGlassElement } from './utils';

const DEFAULT_GLASS_WIDTH = 200;
const DEFAULT_GLASS_HEIGHT = 200;

// Cascade offset down-right, sized so the glass behind keeps its title and buttons visible.
const CASCADE_OFFSET = 25;

// Cascade down-right of the active glass; wrap back to the inset at the window edges.
function getCascadedPlacement(windowEl, { width, height }) {
  const activeGlassEl = detachedGlassManager.getActiveDetachedGlass();
  if (!activeGlassEl) return { position: 'center' };

  const windowRect = windowEl.getBoundingClientRect();
  const activeRect = activeGlassEl.getBoundingClientRect();

  let offsetX = activeRect.left - windowRect.left + CASCADE_OFFSET;
  let offsetY = activeRect.top - windowRect.top + CASCADE_OFFSET;

  if (offsetX + width > windowRect.width) offsetX = CASCADE_OFFSET;
  if (offsetY + height > windowRect.height) offsetY = CASCADE_OFFSET;

  return { position: 'top-left', offsetX, offsetY };
}

export default {
  addDetachedGlass(options = {}) {
    // Play the open animation unless the caller opts out.
    const { animateOpen = true, ...glassOptions } = options;

    // Guard size here so the constructor never falls back to its 222 debug default.
    const width = glassOptions.width ?? DEFAULT_GLASS_WIDTH;
    const height = glassOptions.height ?? DEFAULT_GLASS_HEIGHT;

    // An explicit position wins; otherwise cascade from the active glass.
    const { position, offsetX, offsetY } = glassOptions.position
      ? {}
      : getCascadedPlacement(this.windowElement, { width, height });

    const glass = new DetachedGlass({
      actions: this.actions[1],
      binaryWindow: this,
      // Placement first so caller options can override it; size last so it always wins.
      position,
      offsetX,
      offsetY,
      ...glassOptions,
      width,
      height,
    });

    this.windowElement.append(glass.domNode);
    detachedGlassManager.addDetachedGlassByElement(glass.domNode);
    detachedGlassManager.bringToFront(glass.domNode);

    if (animateOpen) animateDetachedGlassOpen(glass.domNode);

    return glass;
  },

  removeDetachedGlass(detachedGlassId, animateClose = true) {
    const removedGlassEl = detachedGlassManager.removeDetachedGlassById(detachedGlassId);
    removedGlassEl && removeDetachedGlassElement(removedGlassEl, animateClose);
    return removedGlassEl;
  },
};
