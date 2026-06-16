import { clamp } from '@/utils';
import { getResizeHandleOverhang } from './utils';

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

      activeMoveGlassEl = glassEl;
      moveStartX = event.pageX;
      moveStartY = event.pageY;

      // Normalize corner-anchored geometry to window-relative left/top.
      const windowRect = this.windowElement.getBoundingClientRect();
      const glassRect = glassEl.getBoundingClientRect();
      moveStartLeft = glassRect.left - windowRect.left;
      moveStartTop = glassRect.top - windowRect.top;

      // Bound the move to the viewport so dragging past an edge never grows the
      // page. clientWidth/Height exclude scrollbars; the handle overhang on the
      // right/bottom is reserved so hover handles stay on-screen too.
      const overhang = getResizeHandleOverhang(this.windowElement);
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      minMoveLeft = -windowRect.left;
      maxMoveLeft = viewportWidth - glassRect.width - overhang - windowRect.left;
      minMoveTop = -windowRect.top;
      maxMoveTop = viewportHeight - glassRect.height - overhang - windowRect.top;
    });

    this.windowElement.addEventListener('pointermove', (event) => {
      if (!activeMoveGlassEl) return;

      // Clamp to the viewport; a glass larger than the viewport pins to the top-left edge.
      const left = clamp(moveStartLeft + (event.pageX - moveStartX), minMoveLeft, maxMoveLeft);
      const top = clamp(moveStartTop + (event.pageY - moveStartY), minMoveTop, maxMoveTop);

      activeMoveGlassEl.style.right = 'auto';
      activeMoveGlassEl.style.bottom = 'auto';
      activeMoveGlassEl.style.left = `${left}px`;
      activeMoveGlassEl.style.top = `${top}px`;
    });

    this.windowElement.addEventListener('pointerup', (event) => {
      if (!activeMoveGlassEl) return;

      if (event.target.hasPointerCapture?.(event.pointerId)) {
        event.target.releasePointerCapture(event.pointerId);
      }

      activeMoveGlassEl = null;
    });
  },
};
