import { DetachedGlass } from './detached-glass';
import { animateDetachedGlassOpen, removeDetachedGlassElement } from './utils';

class DetachedGlassManager {
  constructor() {
    this.detachedGlassElements = [];
    // Rising counter so the most recently grabbed glass stacks on top, like an OS window.
    this.topZIndex = 1;
  }

  // Caller owns only the DOM `append` (parent differs: `bw-window` vs. `document.body`)
  // and reads the returned element's `style.zIndex` for the windowless modal backdrop.
  addDetachedGlass(options = {}) {
    const { animateOpen = true, ...glassOptions } = options;

    const glassEl = new DetachedGlass(glassOptions).domNode;

    // Ids must be unique in the stack: remove/update/backdrop all key off the id.
    if (this.getDetachedGlassById(glassEl.id)) {
      throw new Error(`[bwin] A detached glass with id "${glassEl.id}" already exists`);
    }

    this.detachedGlassElements.push(glassEl);
    this.bringToFront(glassEl);

    if (animateOpen) animateDetachedGlassOpen(glassEl);

    return glassEl;
  }

  getDetachedGlassById(id) {
    return this.detachedGlassElements.find((glassEl) => glassEl.id === id) ?? null;
  }

  // The front-most glass owns the [active] marker (set in bringToFront).
  getActiveDetachedGlass() {
    return this.detachedGlassElements.find((glassEl) => glassEl.hasAttribute('active')) ?? null;
  }

  bringToFront(glassEl) {
    // Already front-most (it owns the [active] marker) → nothing to raise.
    if (glassEl.hasAttribute('active')) return;

    // Step by 2 (not 1) so the odd slot just below stays free for a windowless modal backdrop.
    this.topZIndex += 2;
    glassEl.style.zIndex = this.topZIndex;

    // Only the front-most glass keeps [active] (drives the stronger shadow); cleared
    // across all so a detached + a windowless glass can't both look active at once.
    this.detachedGlassElements.forEach((el) => el !== glassEl && el.removeAttribute('active'));
    glassEl.setAttribute('active', '');

    return this.topZIndex;
  }

  // Unregister and tear down: splice from the registry AND remove the DOM node
  // (animated by default) plus any modal backdrop.
  removeDetachedGlass(id, { animate = true, onComplete = () => {} } = {}) {
    const index = this.detachedGlassElements.findIndex((glassEl) => glassEl.id === id);
    if (index === -1) return null;

    const [removedGlassEl] = this.detachedGlassElements.splice(index, 1);
    removeDetachedGlassElement(removedGlassEl, animate, onComplete);
    return removedGlassEl;
  }

  // Tentative: in-place update of an existing detached glass (title/content/etc.).
  updateDetachedGlass(id, options) {
    throw new Error('[bwin] updateDetachedGlass is not implemented yet');
  }
}

export const detachedGlassManager = new DetachedGlassManager();
