import { DetachedGlass } from './class';
import { detachedGlassManager } from './manager';
import { createResizeHandles } from './utils';

const MIN_WIDTH = 100;
const MIN_HEIGHT = 60;

// Rising counter so the most recently grabbed glass stacks on top, like an OS window.
let topZIndex = 1;

function bringToFront(glassEl) {
  topZIndex += 1;
  glassEl.style.zIndex = topZIndex;

  // Mark this glass as the active (focused) one, clearing the rest — like
  // focusing an OS window. Drives the stronger drop-shadow in CSS.
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
    const glass = new DetachedGlass(options);
    this.windowElement.append(glass.domNode);
    detachedGlassManager.add(glass.domNode);
    bringToFront(glass.domNode);

    return glass;
  },

  enableDetachedGlassActivate() {
    // Clicking anywhere in a detached glass focuses it and brings it to front,
    // like an OS window. Runs for move/resize grabs too (they bubble here),
    // so focus handling lives in one place.
    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      const glassEl = event.target.closest?.('bw-glass[detached]');
      if (glassEl) bringToFront(glassEl);
    });
  },

  enableDetachedGlassMove() {
    // Drag the header to move the glass freely, like an OS window.
    // Same conventions as resize: delegated pointer events on windowElement,
    // setPointerCapture so the drag survives the pointer leaving the header,
    // and geometry normalized to window-relative left/top.
    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      // Start a move from anywhere in the header (incl. the title text),
      // but not from its interactive controls (action buttons, tabs).
      const headerEl = event.target.closest('bw-glass-header');
      if (!headerEl || event.target.closest('button')) return;
      if (headerEl.getAttribute('can-drag') === 'false') return;

      const glassEl = headerEl.closest('bw-glass[detached]');
      if (!glassEl) return;

      event.preventDefault();
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
    // Create resize handles only while a detached glass is hovered, and
    // remove them on leave — so idle glasses cost no extra DOM nodes.
    // Delegated on `windowElement`: a constant 5 listeners regardless of
    // how many detached glasses exist. `closest` on target/relatedTarget
    // gives enter/leave semantics for the whole glass subtree (handles
    // included), so moving onto a handle does not count as leaving.
    this.windowElement.addEventListener('pointerover', (event) => {
      const glassEl = event.target.closest?.('bw-glass[detached]');
      if (glassEl) addResizeHandles(glassEl);
    });

    this.windowElement.addEventListener('pointerout', (event) => {
      const glassEl = event.target.closest?.('bw-glass[detached]');
      if (!glassEl) return;

      // Still inside the same glass subtree → not a real leave.
      const toGlassEl = event.relatedTarget?.closest?.('bw-glass[detached]');
      if (toGlassEl === glassEl) return;

      // Keep handles while this glass is being resized; cleaned up on pointerup.
      if (glassEl === this.activeResizeGlassEl) return;

      removeResizeHandles(glassEl);
    });

    // Identify which detached glass and which edge/corner to resize.
    // Pointer events give a single code path for mouse/touch/pen, and
    // `setPointerCapture` keeps move events flowing even when the pointer
    // leaves the handle or the window, so no document-level listeners.
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

      // Normalize corner-anchored geometry (top/right/bottom/left + offset)
      // into plain left/top/width/height so every edge resizes with the same math.
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
        width = Math.max(MIN_WIDTH, start.width + distX);
      }
      else if (dir.includes('w')) {
        width = Math.max(MIN_WIDTH, start.width - distX);
        left = start.left + (start.width - width);
      }

      if (dir.includes('s')) {
        height = Math.max(MIN_HEIGHT, start.height + distY);
      }
      else if (dir.includes('n')) {
        height = Math.max(MIN_HEIGHT, start.height - distY);
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

      // If the drag ended with the pointer outside the glass, the guarded
      // pointerout never removed the handles — drop them now.
      if (!glassEl.matches(':hover')) removeResizeHandles(glassEl);
    });
  },
};
