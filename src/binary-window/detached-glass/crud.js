import { removeDetachedGlassElement } from './utils';
import { transferGlass } from '../glass/utils';
import { animateElementByAttribute } from '@/animate';

const DEFAULT_GLASS_WIDTH = 200;
const DEFAULT_GLASS_HEIGHT = 200;

// Cascade offset down-right, sized so the glass behind keeps its title and buttons visible.
const CASCADE_OFFSET = 25;

export default {
  renderDetachedGlasses() {
    for (const glassEl of this.detachedGlassManager.detachedGlassElements) {
      this.windowElement.append(glassEl);
    }
  },

  // Cascade down-right of the active glass; wrap back to the inset at the window edges.
  getCascadedPlacement(windowEl, { width, height }) {
    const activeGlassEl = this.detachedGlassManager.getActiveDetachedGlass();
    if (!activeGlassEl) return { position: 'center' };

    const windowRect = windowEl.getBoundingClientRect();
    const activeRect = activeGlassEl.getBoundingClientRect();

    let offsetX = activeRect.left - windowRect.left + CASCADE_OFFSET;
    let offsetY = activeRect.top - windowRect.top + CASCADE_OFFSET;

    if (offsetX + width > windowRect.width) offsetX = CASCADE_OFFSET;
    if (offsetY + height > windowRect.height) offsetY = CASCADE_OFFSET;

    return { position: 'top-left', offsetX, offsetY };
  },

  addDetachedGlass({ animate = true, originalGlassElement, ...glassOptions } = {}) {
    const width = glassOptions.width ?? DEFAULT_GLASS_WIDTH;
    const height = glassOptions.height ?? DEFAULT_GLASS_HEIGHT;

    // An explicit position wins; otherwise cascade from the active glass.
    const { position, offsetX, offsetY } = glassOptions.position
      ? {}
      : this.getCascadedPlacement(this.windowElement, { width, height });

    const glassEl = this.detachedGlassManager.addDetachedGlass({
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

    return new Promise((resolve) =>
      animateElementByAttribute(glassEl, 'opening', () => resolve(glassEl))
    );
  },

  removeDetachedGlass(id, { animate = true } = {}) {
    const removedGlassEl = this.detachedGlassManager.removeDetachedGlass(id);

    // Already removed (e.g. closed via its action) — no-op so a stale id is harmless.
    if (!removedGlassEl) return Promise.resolve(null);

    return new Promise((resolve) =>
      removeDetachedGlassElement(removedGlassEl, animate, () => resolve(removedGlassEl))
    );
  },

  updateDetachedGlass(...args) {
    return this.detachedGlassManager.updateDetachedGlass(...args);
  },
};
