import { detachedGlassManager } from './manager';
import { removeDetachedGlassElement, animateDetachedGlassOpen } from './utils';
import { transferGlass } from '../glass/utils';

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
  addDetachedGlass({ animate = true, originalGlassElement, ...glassOptions } = {}) {
    const width = glassOptions.width ?? DEFAULT_GLASS_WIDTH;
    const height = glassOptions.height ?? DEFAULT_GLASS_HEIGHT;

    // An explicit position wins; otherwise cascade from the active glass.
    const { position, offsetX, offsetY } = glassOptions.position
      ? {}
      : getCascadedPlacement(this.windowElement, { width, height });

    const glassEl = detachedGlassManager.addDetachedGlass({
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

    if (originalGlassElement) {
      transferGlass(originalGlassElement, glassEl);
    }

    this.windowElement.append(glassEl);

    if (!animate) return Promise.resolve(glassEl);

    return new Promise((resolve) => animateDetachedGlassOpen(glassEl, () => resolve(glassEl)));
  },

  removeDetachedGlass(id, { animate = true } = {}) {
    const removedGlassEl = detachedGlassManager.removeDetachedGlass(id);

    return new Promise((resolve) =>
      removeDetachedGlassElement(removedGlassEl, animate, () => resolve(removedGlassEl))
    );
  },

  updateDetachedGlass(...args) {
    return detachedGlassManager.updateDetachedGlass(...args);
  },
};
