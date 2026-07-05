import { clamp } from '@/utils';

// Clamp to [min, max], but if `prev` is already outside it (off-screen target),
// relax that breached edge to `prev`: the target may move toward the viewport, never further out.
function clampAxis(value, min, max, prev) {
  const lo = Math.min(min, prev);
  const hi = Math.max(max, prev);
  return clamp(value, lo, hi);
}

// Viewport-space top-left of an absolutely-positioned element's containing block.
// RATIONAL: duplicated from `detached-glass/utils`; importing would couple this
// engine backwards into the glass module. Consolidate once `move.js` adopts it.
function getContainingBlockOrigin(el) {
  const offsetParentEl = el.offsetParent;

  if (offsetParentEl && getComputedStyle(offsetParentEl).position !== 'static') {
    const { left, top } = offsetParentEl.getBoundingClientRect();
    return { left, top };
  }

  return { left: -window.scrollX, top: -window.scrollY };
}

export class MoveController {
  constructor({
    target,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    // Px to keep clear on the right/bottom edges (e.g. resize-handle overhang, so hover
    // handles stay on-screen). Belongs to the target; update it alongside setTarget.
    targetEdgeReserve = 0,
  } = {}) {
    this.targetElement = target;
    this.onPointerDown = onPointerDown;
    this.onPointerMove = onPointerMove;
    this.onPointerUp = onPointerUp;
    this.targetEdgeReserve = targetEdgeReserve;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);

    this.isMoveStarted = false;
    this.captureElement = null;
    this.capturePointerId = null;
  }

  setTarget(element, { edgeReserve = 0 } = {}) {
    this.targetElement = element;
    this.targetEdgeReserve = edgeReserve;
  }

  handlePointerDown(event) {
    if (event.button !== 0 || !this.targetElement) return;

    event.preventDefault();

    // setPointerCapture keeps move events flowing when the pointer leaves the pressed element.
    this.captureElement = event.target;
    this.capturePointerId = event.pointerId;
    this.captureElement.setPointerCapture?.(event.pointerId);

    this.startX = event.pageX;
    this.startY = event.pageY;

    // Normalize corner-anchored geometry to left/top relative to the containing block.
    const origin = getContainingBlockOrigin(this.targetElement);
    const targetRect = this.targetElement.getBoundingClientRect();
    this.startLeft = targetRect.left - origin.left;
    this.startTop = targetRect.top - origin.top;

    // Bound the move to the viewport, captured once per grab: `clientWidth/Height`
    // exclude scrollbars, and dragging past an edge never grows the page.
    // `targetEdgeReserve` keeps clear space on the right/bottom (e.g. resize-handle overhang).
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    this.minLeft = -origin.left;
    this.maxLeft = viewportWidth - targetRect.width - this.targetEdgeReserve - origin.left;
    this.minTop = -origin.top;
    this.maxTop = viewportHeight - targetRect.height - this.targetEdgeReserve - origin.top;

    this.lastLeft = this.startLeft;
    this.lastTop = this.startTop;

    this.isMoveStarted = true;

    this.onPointerDown?.(event);
  }

  handlePointerMove(event) {
    // `targetElement` can be cleared mid-drag (e.g. consumer calls setTarget(null)).
    if (!this.isMoveStarted || !this.targetElement) return;

    const targetLeft = this.startLeft + (event.pageX - this.startX);
    const targetTop = this.startTop + (event.pageY - this.startY);

    // `last*` guards an off-screen target to inward-only motion; once back inside,
    // clampAxis falls through to the normal viewport edge.
    const left = clampAxis(targetLeft, this.minLeft, this.maxLeft, this.lastLeft);
    const top = clampAxis(targetTop, this.minTop, this.maxTop, this.lastTop);

    this.lastLeft = left;
    this.lastTop = top;

    this.targetElement.style.right = 'auto';
    this.targetElement.style.bottom = 'auto';
    this.targetElement.style.left = `${left}px`;
    this.targetElement.style.top = `${top}px`;

    this.onPointerMove?.(event);
  }

  handlePointerUp(event) {
    if (!this.isMoveStarted) return;

    if (this.captureElement?.hasPointerCapture?.(this.capturePointerId)) {
      this.captureElement.releasePointerCapture(this.capturePointerId);
    }

    this.isMoveStarted = false;
    this.captureElement = null;
    this.capturePointerId = null;
    // Clear so the next press re-resolves its target (consumer-set or the pressed element).
    this.targetElement = null;

    this.onPointerUp?.(event);
  }

  enable() {
    document.addEventListener('pointerdown', this.handlePointerDown);
    document.addEventListener('pointermove', this.handlePointerMove);
    document.addEventListener('pointerup', this.handlePointerUp);
  }

  disable() {
    document.removeEventListener('pointerdown', this.handlePointerDown);
    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerup', this.handlePointerUp);
  }
}
