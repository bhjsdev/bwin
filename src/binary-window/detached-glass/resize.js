import { createResizeHandles } from './utils';

const MIN_RESIZE_WIDTH = 100;
const MIN_RESIZE_HEIGHT = 60;

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
  enableDetachedGlassResize() {
    let activeResizeGlassEl = null;
    let activeResizeDir = '';
    let resizeStartX = 0;
    let resizeStartY = 0;
    let resizeStartRect = null;

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
      if (glassEl === activeResizeGlassEl) return;

      removeResizeHandles(glassEl);
    });

    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.target.tagName !== 'BW-GLASS-RESIZE-HANDLE') return;

      const glassEl = event.target.closest('bw-glass[detached]');
      if (!glassEl) return;

      event.preventDefault();
      event.target.setPointerCapture(event.pointerId);

      activeResizeGlassEl = glassEl;
      activeResizeDir = event.target.getAttribute('resize-dir');
      resizeStartX = event.pageX;
      resizeStartY = event.pageY;

      // Normalize corner-anchored geometry to window-relative left/top/width/height
      // so every edge resizes with the same math.
      const windowRect = this.windowElement.getBoundingClientRect();
      const glassRect = glassEl.getBoundingClientRect();
      resizeStartRect = {
        left: glassRect.left - windowRect.left,
        top: glassRect.top - windowRect.top,
        width: glassRect.width,
        height: glassRect.height,
      };
    });

    this.windowElement.addEventListener('pointermove', (event) => {
      if (!activeResizeGlassEl) return;

      const dir = activeResizeDir;
      const distX = event.pageX - resizeStartX;
      const distY = event.pageY - resizeStartY;
      const start = resizeStartRect;

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

      activeResizeGlassEl.style.right = 'auto';
      activeResizeGlassEl.style.bottom = 'auto';
      activeResizeGlassEl.style.left = `${left}px`;
      activeResizeGlassEl.style.top = `${top}px`;
      activeResizeGlassEl.style.width = `${width}px`;
      activeResizeGlassEl.style.height = `${height}px`;
    });

    this.windowElement.addEventListener('pointerup', (event) => {
      if (!activeResizeGlassEl) return;

      if (event.target.hasPointerCapture?.(event.pointerId)) {
        event.target.releasePointerCapture(event.pointerId);
      }

      const glassEl = activeResizeGlassEl;

      activeResizeGlassEl = null;
      activeResizeDir = '';
      resizeStartRect = null;

      // pointerout was suppressed during the resize; drop handles if no longer hovered.
      if (!glassEl.matches(':hover')) removeResizeHandles(glassEl);
    });
  },
};
