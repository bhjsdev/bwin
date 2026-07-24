import { DetachedGlass } from './detached-glass';
import { getContainingBlockOrigin } from './utils';

export class DetachedGlassManager {
  constructor({ zIndex = 1 } = {}) {
    this.detachedGlassElements = [];
    this.topZIndex = zIndex;
  }

  setBaseZIndex(zIndex) {
    this.topZIndex = zIndex;
  }

  // Caller owns only the DOM `append` (parent differs: `bw-window` vs. `document.body`)
  // and reads the returned element's `style.zIndex` for the windowless modal backdrop.
  addDetachedGlass(options) {
    const glassEl = new DetachedGlass(options).domNode;

    // Ids must be unique in the stack: remove/update/backdrop all key off the id.
    if (this.getDetachedGlassById(glassEl.id)) {
      throw new Error(`[bwin] A detached glass with id "${glassEl.id}" already exists`);
    }

    this.detachedGlassElements.push(glassEl);

    // Default active so normal creation brings the new glass to front. A config
    // restore passes `active: false` for background glasses to keep their zIndex.
    const { active = true } = options;
    if (active) this.bringToFront(glassEl);

    return glassEl;
  }

  getDetachedGlassById(id) {
    return this.detachedGlassElements.find((glassEl) => glassEl.id === id) ?? null;
  }

  getActiveDetachedGlass() {
    return this.detachedGlassElements.find((glassEl) => glassEl.hasAttribute('active')) ?? null;
  }

  bringToFront(glassEl) {
    if (glassEl.hasAttribute('active')) return;
    // Step by 2 (not 1) so the odd slot just below stays free for a modal backdrop.
    this.topZIndex += 2;
    glassEl.style.zIndex = this.topZIndex;

    this.detachedGlassElements.forEach((el) => el !== glassEl && el.removeAttribute('active'));
    glassEl.setAttribute('active', '');

    return this.topZIndex;
  }

  removeDetachedGlass(id) {
    const index = this.detachedGlassElements.findIndex((glassEl) => glassEl.id === id);
    if (index === -1) return null;

    const [removedGlassEl] = this.detachedGlassElements.splice(index, 1);
    return removedGlassEl;
  }

  // Tentative: in-place update of an existing detached glass (title/content/etc.).
  updateDetachedGlass(id, options) {
    throw new Error('[bwin] updateDetachedGlass is not implemented yet');
  }

  createConfig() {
    return this.detachedGlassElements.map((glassEl) => {
      const { left: originLeft, top: originTop } = getContainingBlockOrigin(glassEl);
      const rect = glassEl.getBoundingClientRect();
      const headerEl = glassEl.querySelector('bw-glass-header');

      return {
        id: glassEl.id,
        top: rect.top - originTop,
        left: rect.left - originLeft,
        width: rect.width,
        height: rect.height,
        zIndex: parseInt(glassEl.style.zIndex, 10) || 0,
        resizable: glassEl.getAttribute('can-resize') !== 'false',
        draggable: headerEl?.getAttribute('can-drag') !== 'false',
        active: glassEl.hasAttribute('active'),
        minimized: glassEl.hasAttribute('minimized'),
      };
    });
  }
}
