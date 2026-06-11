import { DetachedGlass } from './detached-glass';
import { detachedGlassManager } from './manager';

const DEFAULT_GLASS_WIDTH = 200;
const DEFAULT_GLASS_HEIGHT = 200;

// Cascade offset down-right, sized so the glass behind keeps its title and buttons visible.
const CASCADE_OFFSET = 25;

// Cascade down-right of the active glass; wrap back to the inset at the window edges.
function getCascadedPlacement(windowEl, { width, height }) {
  const activeGlassEl = detachedGlassManager.getActiveGlass();
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
    // Guard size here so the constructor never falls back to its 222 debug default.
    const width = options.width ?? DEFAULT_GLASS_WIDTH;
    const height = options.height ?? DEFAULT_GLASS_HEIGHT;

    // An explicit position wins; otherwise cascade from the active glass.
    const { position, offsetX, offsetY } = options.position
      ? {}
      : getCascadedPlacement(this.windowElement, { width, height });

    const glass = new DetachedGlass({
      actions: this.actions[1],
      binaryWindow: this,
      // Placement first so caller options can override it; size last so it always wins.
      position,
      offsetX,
      offsetY,
      ...options,
      width,
      height,
    });

    this.windowElement.append(glass.domNode);
    detachedGlassManager.addGlassByElement(glass.domNode);
    detachedGlassManager.bringToFront(glass.domNode);

    return glass;
  },

  removeDetachedGlass(detachedGlassId) {
    const removedGlassEl = detachedGlassManager.removeGlassById(detachedGlassId);
    removedGlassEl?.remove();
    return removedGlassEl;
  },
};
