// Edges first, corners last so corner handles paint on top of the edge handles
const RESIZE_DIRECTIONS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

export function createResizeHandles() {
  return RESIZE_DIRECTIONS.map((dir) => {
    const handleEl = document.createElement('bw-glass-resize-handle');
    handleEl.setAttribute('resize-dir', dir);
    return handleEl;
  });
}

// `offset` nudges the glass from the anchored corner/edge; it has no effect on
// a centered glass, which is positioned purely from its own size.
export function genStylesByPosition({ position, offset, width, height }) {
  switch (position) {
    case 'top-left':
      return { top: `${offset}px`, left: `${offset}px`, right: 'auto', bottom: 'auto' };
    case 'top-right':
      return { top: `${offset}px`, right: `${offset}px`, left: 'auto', bottom: 'auto' };
    case 'bottom-left':
      return { bottom: `${offset}px`, left: `${offset}px`, right: 'auto', top: 'auto' };
    case 'bottom-right':
      return { bottom: `${offset}px`, right: `${offset}px`, left: 'auto', top: 'auto' };
    case 'center':
      // Offset by half the glass size so it is centered, not just top-left at center.
      // Use calc() rather than a transform to keep left/top in sync with drag/resize math.
      return {
        top: `calc(50% - ${height / 2}px)`,
        left: `calc(50% - ${width / 2}px)`,
        right: 'auto',
        bottom: 'auto',
      };
    default:
      throw new Error(`Position "${position}" is not supported for detached glass.`);
  }
}
