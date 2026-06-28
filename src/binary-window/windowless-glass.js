import { DEFAULT_WINDOWLESS_GLASS_ACTIONS } from './detached-glass';
import { detachedGlassManager } from './detached-glass/manager';
import {
  animateDetachedGlassOpen,
  animateGlassBackdropOpen,
  removeDetachedGlassElement,
} from './detached-glass/utils';

export default {
  /**
   * Add a windowless glass: a detached glass that floats on `document.body` instead
   * of inside a `bw-window`, so it isn't owned by any window instance. Managed by the
   * shared glass manager (z-index/activation) like an in-window detached glass.
   *
   * @param {Object} [glassOptions]
   * @param {boolean} [glassOptions.modal] - When true, append a `<bw-glass-backdrop for="<glassId>">`
   *   behind the glass to block interaction with everything underneath.
   * @param {'center'|'top-left'|'top-right'|'bottom-left'|'bottom-right'} [glassOptions.position='center'] - Where to anchor the glass.
   * @param {number} [glassOptions.width] - Glass width in px.
   * @param {number} [glassOptions.height] - Glass height in px.
   * @param {number} [glassOptions.offset=0] - Distance in px from the anchored corner/edge (no effect on `center`).
   * @param {number} [glassOptions.offsetX] - Per-axis override of `offset` on the x-axis.
   * @param {number} [glassOptions.offsetY] - Per-axis override of `offset` on the y-axis.
   * @param {string} [glassOptions.id] - Glass id; auto-generated (suffixed `-F`) when omitted.
   * @param {Object[]} [glassOptions.actions] - Action buttons; defaults to `DEFAULT_WINDOWLESS_GLASS_ACTIONS` (close only).
   * @param {string|Node} [glassOptions.title] - Header title.
   * @param {string|Node} [glassOptions.content] - Glass body content.
   * @param {Object[]} [glassOptions.tabs] - Header tabs (shown instead of `title`).
   * @param {boolean} [glassOptions.draggable=true] - Whether the header can be dragged to move the glass.
   * @param {boolean} [glassOptions.resizable=true] - Whether resize handles appear on hover so the glass can be resized.
   * @param {boolean} [glassOptions.animateOpen=true] - Whether to play the open animation on insert.
   * @returns {Element} - The `bw-glass[detached][windowless]` element
   */
  addWindowlessGlass({ animate = true, modal = false, ...glassOptions } = {}) {
    const glassEl = detachedGlassManager.addDetachedGlass({
      actions: DEFAULT_WINDOWLESS_GLASS_ACTIONS,
      position: 'center',
      ...glassOptions,
    });

    glassEl.setAttribute('windowless', '');
    document.body.append(glassEl);

    if (modal) {
      const backdropEl = document.createElement('bw-glass-backdrop');
      backdropEl.setAttribute('for', glassEl.id);
      // addDetachedGlass reserved the slot just below the glass (`topZIndex += 2`).
      backdropEl.style.zIndex = Number(glassEl.style.zIndex) - 1;
      document.body.append(backdropEl);
      if (animate) animateGlassBackdropOpen(backdropEl);
    }

    if (!animate) return Promise.resolve(glassEl);
    return new Promise((resolve) => animateDetachedGlassOpen(glassEl, () => resolve(glassEl)));
  },

  removeWindowlessGlass(id, { animate = true } = {}) {
    const detachedGlassEl = detachedGlassManager.removeDetachedGlass(id);

    if (!animate) {
      return Promise.resolve(detachedGlassEl);
    }

    return new Promise((resolve) =>
      removeDetachedGlassElement(detachedGlassEl, animate, () => resolve(detachedGlassEl))
    );
  },
};
