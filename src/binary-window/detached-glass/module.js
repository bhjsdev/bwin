import { DetachedGlass } from './class';
import { detachedGlassManager } from './manager';
import { createResizeHandles } from './utils';

const DEFAULT_GLASS_WIDTH = 200;
const DEFAULT_GLASS_HEIGHT = 200;

const MIN_RESIZE_WIDTH = 100;
const MIN_RESIZE_HEIGHT = 60;

// Cascade offset down-right, sized so the glass behind keeps its title and buttons visible.
const CASCADE_OFFSET = 25;

// Rising counter so the most recently grabbed glass stacks on top, like an OS window.
let topZIndex = 1;

function bringToFront(glassEl) {
  // Already front-most (it owns the [active] marker) → nothing to raise.
  if (glassEl.hasAttribute('active')) return;

  topZIndex += 1;
  glassEl.style.zIndex = topZIndex;

  // Only the front-most glass keeps [active]; it drives the stronger shadow in CSS.
  glassEl.parentElement
    ?.querySelectorAll(':scope > bw-glass[detached][active]')
    .forEach((el) => el !== glassEl && el.removeAttribute('active'));
  glassEl.setAttribute('active', '');
}

function hasResizeHandles(glassEl) {
  return Boolean(glassEl.querySelector(':scope > bw-glass-resize-handle'));
}

function addResizeHandles(glassEl) {
  if (!hasResizeHandles(glassEl)) {
    glassEl.append(...createResizeHandles());
  }
}

function removeResizeHandles(glassEl) {
  glassEl.querySelectorAll(':scope > bw-glass-resize-handle').forEach((el) => el.remove());
}

export default {
  activeResizeGlassEl: null,
  activeResizeDir: '',
  resizeStartX: 0,
  resizeStartY: 0,
  resizeStartRect: null,

  activeMoveGlassEl: null,
  moveStartX: 0,
  moveStartY: 0,
  moveStartLeft: 0,
  moveStartTop: 0,

  addDetachedGlass(options = {}) {
    // Guard size here so the constructor never falls back to its 222 debug default.
    const width = options.width ?? DEFAULT_GLASS_WIDTH;
    const height = options.height ?? DEFAULT_GLASS_HEIGHT;

    // An explicit position wins; otherwise cascade from the active glass.
    const { position, offsetX, offsetY } = options.position
      ? {}
      : this.getCascadedPlacement({ width, height });

    const glass = new DetachedGlass({
      actions: this.actions[1],
      // Placement first so caller options can override it; size last so it always wins.
      position,
      offsetX,
      offsetY,
      ...options,
      width,
      height,
    });
    this.windowElement.append(glass.domNode);
    detachedGlassManager.addGlass(glass.domNode);
    bringToFront(glass.domNode);

    return glass;
  },

  getCascadedPlacement({ width, height }) {
    const activeGlassEl = detachedGlassManager.getActiveGlass();
    if (!activeGlassEl) return { position: 'center' };

    // Cascade down-right of the active glass, anchored from the top-left.
    const windowRect = this.windowElement.getBoundingClientRect();
    const activeRect = activeGlassEl.getBoundingClientRect();

    let offsetX = activeRect.left - windowRect.left + CASCADE_OFFSET;
    let offsetY = activeRect.top - windowRect.top + CASCADE_OFFSET;

    // Wrap back to the top-left inset once a step would run off the right/bottom edge.
    if (offsetX + width > windowRect.width) offsetX = CASCADE_OFFSET;
    if (offsetY + height > windowRect.height) offsetY = CASCADE_OFFSET;

    return { position: 'top-left', offsetX, offsetY };
  },

  enableDetachedGlassActivate() {
    // Clicking anywhere in a detached glass brings it to front. Move/resize
    // grabs bubble here too, so focus handling lives in one place.
    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      const glassEl = event.target.closest?.('bw-glass[detached]');
      if (glassEl) bringToFront(glassEl);
    });
  },

  enableDetachedGlassMove() {
    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      // Move from anywhere in the header (incl. title text), but not its buttons.
      const headerEl = event.target.closest('bw-glass-header');
      if (!headerEl || event.target.closest('button')) return;
      if (headerEl.getAttribute('can-drag') === 'false') return;

      const glassEl = headerEl.closest('bw-glass[detached]');
      if (!glassEl) return;

      event.preventDefault();
      // setPointerCapture keeps move events flowing when the pointer leaves the header.
      headerEl.setPointerCapture(event.pointerId);

      this.activeMoveGlassEl = glassEl;
      this.moveStartX = event.pageX;
      this.moveStartY = event.pageY;

      // Normalize corner-anchored geometry to window-relative left/top.
      const windowRect = this.windowElement.getBoundingClientRect();
      const glassRect = glassEl.getBoundingClientRect();
      this.moveStartLeft = glassRect.left - windowRect.left;
      this.moveStartTop = glassRect.top - windowRect.top;
    });

    this.windowElement.addEventListener('pointermove', (event) => {
      if (!this.activeMoveGlassEl) return;

      const left = this.moveStartLeft + (event.pageX - this.moveStartX);
      const top = this.moveStartTop + (event.pageY - this.moveStartY);

      const glassEl = this.activeMoveGlassEl;
      glassEl.style.right = 'auto';
      glassEl.style.bottom = 'auto';
      glassEl.style.left = `${left}px`;
      glassEl.style.top = `${top}px`;
    });

    this.windowElement.addEventListener('pointerup', (event) => {
      if (!this.activeMoveGlassEl) return;

      if (event.target.hasPointerCapture?.(event.pointerId)) {
        event.target.releasePointerCapture(event.pointerId);
      }

      this.activeMoveGlassEl = null;
    });
  },

  enableDetachedGlassResize() {
    // Handles exist only while a glass is hovered, so idle glasses cost no extra DOM.
    this.windowElement.addEventListener('pointerover', (event) => {
      const glassEl = event.target.closest?.('bw-glass[detached]');
      if (glassEl) addResizeHandles(glassEl);
    });

    this.windowElement.addEventListener('pointerout', (event) => {
      const glassEl = event.target.closest?.('bw-glass[detached]');
      if (!glassEl) return;

      // Moving within the same glass subtree (e.g. onto a handle) is not a leave.
      const toGlassEl = event.relatedTarget?.closest?.('bw-glass[detached]');
      if (toGlassEl === glassEl) return;

      // Keep handles while resizing; pointerup cleans them up.
      if (glassEl === this.activeResizeGlassEl) return;

      removeResizeHandles(glassEl);
    });

    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.target.tagName !== 'BW-GLASS-RESIZE-HANDLE') return;

      const glassEl = event.target.closest('bw-glass[detached]');
      if (!glassEl) return;

      event.preventDefault();
      event.target.setPointerCapture(event.pointerId);

      this.activeResizeGlassEl = glassEl;
      this.activeResizeDir = event.target.getAttribute('resize-dir');
      this.resizeStartX = event.pageX;
      this.resizeStartY = event.pageY;

      // Normalize corner-anchored geometry to window-relative left/top/width/height
      // so every edge resizes with the same math.
      const windowRect = this.windowElement.getBoundingClientRect();
      const glassRect = glassEl.getBoundingClientRect();
      this.resizeStartRect = {
        left: glassRect.left - windowRect.left,
        top: glassRect.top - windowRect.top,
        width: glassRect.width,
        height: glassRect.height,
      };
    });

    this.windowElement.addEventListener('pointermove', (event) => {
      if (!this.activeResizeGlassEl) return;

      const dir = this.activeResizeDir;
      const distX = event.pageX - this.resizeStartX;
      const distY = event.pageY - this.resizeStartY;
      const start = this.resizeStartRect;

      let { left, top, width, height } = start;

      if (dir.includes('e')) {
        width = Math.max(MIN_RESIZE_WIDTH, start.width + distX);
      }
      else if (dir.includes('w')) {
        width = Math.max(MIN_RESIZE_WIDTH, start.width - distX);
        left = start.left + (start.width - width);
      }

      if (dir.includes('s')) {
        height = Math.max(MIN_RESIZE_HEIGHT, start.height + distY);
      }
      else if (dir.includes('n')) {
        height = Math.max(MIN_RESIZE_HEIGHT, start.height - distY);
        top = start.top + (start.height - height);
      }

      const glassEl = this.activeResizeGlassEl;
      glassEl.style.right = 'auto';
      glassEl.style.bottom = 'auto';
      glassEl.style.left = `${left}px`;
      glassEl.style.top = `${top}px`;
      glassEl.style.width = `${width}px`;
      glassEl.style.height = `${height}px`;
    });

    this.windowElement.addEventListener('pointerup', (event) => {
      if (!this.activeResizeGlassEl) return;

      if (event.target.hasPointerCapture?.(event.pointerId)) {
        event.target.releasePointerCapture(event.pointerId);
      }

      const glassEl = this.activeResizeGlassEl;

      this.activeResizeGlassEl = null;
      this.activeResizeDir = '';
      this.resizeStartRect = null;

      // pointerout was suppressed during the resize; drop handles if no longer hovered.
      if (!glassEl.matches(':hover')) removeResizeHandles(glassEl);
    });
  },
};
