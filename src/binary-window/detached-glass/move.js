import { clamp } from '@/utils';
import { getResizeHandleOverhang, getContainingBlockOrigin } from './utils';

export default {
  enableDetachedGlassMove() {
    let activeMoveGlassEl = null;
    let moveStartX = 0;
    let moveStartY = 0;
    let moveStartLeft = 0;
    let moveStartTop = 0;
    // Window-relative bounds that keep the glass within the viewport, captured at grab time.
    let minMoveLeft = 0;
    let maxMoveLeft = 0;
    let minMoveTop = 0;
    let maxMoveTop = 0;

    document.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      // Move from anywhere in the header (incl. title text), but not its buttons.
      const headerEl = event.target.closest('bw-glass-header');
      if (!headerEl || event.target.closest('button')) return;
      if (headerEl.getAttribute('can-drag') === 'false') return;

      const glassEl = headerEl.closest('bw-glass[detached]');
      if (!glassEl) return;

      event.preventDefault();
      // Capture on the actually-pressed element so it keeps move events and its own
      // drag cursor: header → `move`, attach indicator → `copy`.
      const captureEl = event.target.closest('bw-attach-indicator') || headerEl;
      captureEl.setPointerCapture(event.pointerId);

      activeMoveGlassEl = glassEl;
      moveStartX = event.pageX;
      moveStartY = event.pageY;

      // Normalize corner-anchored geometry to left/top relative to the glass's
      // containing block (the window for a detached glass, the viewport for a windowless one).
      const origin = getContainingBlockOrigin(glassEl);
      const glassRect = glassEl.getBoundingClientRect();
      moveStartLeft = glassRect.left - origin.left;
      moveStartTop = glassRect.top - origin.top;

      // Bound the move to the viewport so dragging past an edge never grows the
      // page. clientWidth/Height exclude scrollbars; the handle overhang on the
      // right/bottom is reserved so hover handles stay on-screen too.
      const overhang = getResizeHandleOverhang(glassEl);
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      minMoveLeft = -origin.left;
      maxMoveLeft = viewportWidth - glassRect.width - overhang - origin.left;
      minMoveTop = -origin.top;
      maxMoveTop = viewportHeight - glassRect.height - overhang - origin.top;
    });

    document.addEventListener('pointermove', (event) => {
      if (!activeMoveGlassEl) return;

      // Clamp to the viewport; a glass larger than the viewport pins to the top-left edge.
      const left = clamp(moveStartLeft + (event.pageX - moveStartX), minMoveLeft, maxMoveLeft);
      const top = clamp(moveStartTop + (event.pageY - moveStartY), minMoveTop, maxMoveTop);

      activeMoveGlassEl.style.right = 'auto';
      activeMoveGlassEl.style.bottom = 'auto';
      activeMoveGlassEl.style.left = `${left}px`;
      activeMoveGlassEl.style.top = `${top}px`;
    });

    document.addEventListener('pointerup', (event) => {
      if (!activeMoveGlassEl) return;

      if (event.target.hasPointerCapture?.(event.pointerId)) {
        event.target.releasePointerCapture(event.pointerId);
      }

      activeMoveGlassEl = null;
    });
  },
};
