// Edges first, corners last so corner handles paint on top of the edge handles
const RESIZE_DIRECTIONS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

export function createResizeHandles() {
  return RESIZE_DIRECTIONS.map((dir) => {
    const handleEl = document.createElement('bw-glass-resize-handle');
    handleEl.setAttribute('resize-dir', dir);
    return handleEl;
  });
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
