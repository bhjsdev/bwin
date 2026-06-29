import { clamp } from '@/utils';
import { getResizeHandleOverhang, getContainingBlockOrigin } from './utils';

// Clamp to [min, max], but if `prev` is already outside it (off-screen glass),
// relax that breached edge to `prev`: the glass may move toward the viewport, never further out.
function clampAxis(value, min, max, prev) {
  const lo = Math.min(min, prev);
  const hi = Math.max(max, prev);
  return clamp(value, lo, hi);
}

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
    // Last applied position; the out-of-bounds limit for an off-screen glass.
    let lastMoveLeft = 0;
    let lastMoveTop = 0;

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

      // Bound the move to the viewport, captured once per grab. Concerns:
      // - Dragging past an edge never grows the page.
      // - `clientWidth/Height` exclude scrollbars.
      // - The handle overhang on the right/bottom is reserved so hover handles stay on-screen.
      // - Bounds are frozen for the drag, so an off-screen glass that shows a scrollbar
      //   keeps that width reserved as it's dragged back, stopping a scrollbar's width
      //   short of the true edge until the next grab. Accepted as a minor edge-case cost.
      const overhangSize = getResizeHandleOverhang(glassEl);
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      minMoveLeft = -origin.left;
      maxMoveLeft = viewportWidth - glassRect.width - overhangSize - origin.left;
      minMoveTop = -origin.top;
      maxMoveTop = viewportHeight - glassRect.height - overhangSize - origin.top;

      lastMoveLeft = moveStartLeft;
      lastMoveTop = moveStartTop;
    });

    document.addEventListener('pointermove', (event) => {
      if (!activeMoveGlassEl) return;

      const targetLeft = moveStartLeft + (event.pageX - moveStartX);
      const targetTop = moveStartTop + (event.pageY - moveStartY);

      // `lastMove*` guards an off-screen glass to inward-only motion; once back
      // inside, clampAxis falls through to the normal viewport edge.
      const left = clampAxis(targetLeft, minMoveLeft, maxMoveLeft, lastMoveLeft);
      const top = clampAxis(targetTop, minMoveTop, maxMoveTop, lastMoveTop);

      lastMoveLeft = left;
      lastMoveTop = top;

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
