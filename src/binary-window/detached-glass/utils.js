import { animateElementByAttribute } from '@/animate';

// Edges first, corners last so corner handles paint on top of the edge handles
const RESIZE_DIRECTIONS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

export function createResizeHandles() {
  return RESIZE_DIRECTIONS.map((dir) => {
    const handleEl = document.createElement('bw-glass-resize-handle');
    handleEl.setAttribute('resize-dir', dir);
    return handleEl;
  });
}

// Resize handles straddle the glass border, so each overhangs its edge by half
// the handle size. Returns that overhang, so callers can keep handles on-screen.
export function getResizeHandleOverhang(glassEl) {
  const styles = getComputedStyle(glassEl);
  const size = styles.getPropertyValue('--bw-detached-glass-resize-handle-size');
  return (parseFloat(size) || 0) / 2;
}

export function removeGlassBackdrop(glassId, animate = false) {
  const backdropEl = document.querySelector(`bw-glass-backdrop[for="${glassId}"]`);
  if (!backdropEl) return;

  if (!animate) {
    backdropEl.remove();
    return;
  }

  animateElementByAttribute(backdropEl, 'closing', () => backdropEl.remove());
}

export function removeDetachedGlassElement(detachedGlassEl, animate = true, onComplete) {
  removeGlassBackdrop(detachedGlassEl.id, animate);

  const handleRemove = () => {
    detachedGlassEl.remove();
    onComplete?.();
  };

  if (!animate) {
    handleRemove();
    return;
  }

  animateElementByAttribute(detachedGlassEl, 'closing', handleRemove);
}

// Viewport-space top-left of an absolutely-positioned element's containing block.
export function getContainingBlockOrigin(el) {
  const offsetParentEl = el.offsetParent;

  // Detached glass: the positioned `bw-window` IS the containing block, so its
  // rect's top-left is the origin directly.
  if (offsetParentEl && getComputedStyle(offsetParentEl).position !== 'static') {
    const { left, top } = offsetParentEl.getBoundingClientRect();
    return { left, top };
  }

  // Windowless glass on a static `body`: the containing block is the initial one
  // (the canvas at the document origin), which sits scroll-distance above the viewport.
  return { left: -window.scrollX, top: -window.scrollY };
}

// `offset` nudges the glass from the anchored corner/edge. `offsetX`/`offsetY`
// override it per-axis; when only one is given, `offset` fills the other axis.
export function genStylesByPosition({ position, offset, offsetX, offsetY, width, height }) {
  const x = offsetX ?? offset;
  const y = offsetY ?? offset;

  switch (position) {
    case 'top-left':
      return { top: `${y}px`, left: `${x}px`, right: 'auto', bottom: 'auto' };
    case 'top-right':
      return { top: `${y}px`, right: `${x}px`, left: 'auto', bottom: 'auto' };
    case 'bottom-left':
      return { bottom: `${y}px`, left: `${x}px`, right: 'auto', top: 'auto' };
    case 'bottom-right':
      return { bottom: `${y}px`, right: `${x}px`, left: 'auto', top: 'auto' };
    case 'center':
      // calc() rather than a translate transform, so left/top stay in sync with drag/resize math.
      return {
        top: `calc(50% - ${height / 2}px + ${y}px)`,
        left: `calc(50% - ${width / 2}px + ${x}px)`,
        right: 'auto',
        bottom: 'auto',
      };
    default:
      throw new Error(`Position "${position}" is not supported for detached glass.`);
  }
}
