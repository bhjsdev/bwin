import { detachedGlassManager } from './manager';

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
    const { width: optWidth, height: optHeight, position: optPosition } = options;

    // Guard size here so the constructor never falls back to its 222 debug default.
    const width = optWidth ?? DEFAULT_GLASS_WIDTH;
    const height = optHeight ?? DEFAULT_GLASS_HEIGHT;

    // An explicit position wins; otherwise cascade from the active glass.
    const { position, offsetX, offsetY } = optPosition
      ? {}
      : getCascadedPlacement(this.windowElement, { width, height });

    const glassEl = detachedGlassManager.addDetachedGlass({
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

    this.windowElement.append(glassEl);

    return glassEl;
  },

  removeDetachedGlass(detachedGlassId, animateClose = true) {
    return detachedGlassManager.removeDetachedGlass(detachedGlassId, { animateClose });
  },

  updateDetachedGlass(detachedGlassId, options) {
    return detachedGlassManager.updateDetachedGlass(detachedGlassId, options);
  },
};
