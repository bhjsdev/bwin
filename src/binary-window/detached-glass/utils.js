// Edges first, corners last so corner handles paint on top of the edge handles
const RESIZE_DIRECTIONS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

export function createResizeHandles() {
  return RESIZE_DIRECTIONS.map((dir) => {
    const handleEl = document.createElement('bw-glass-resize-handle');
    handleEl.setAttribute('resize-dir', dir);
    return handleEl;
  });
}

export function genStylesByPosition(position, offset) {
  switch (position) {
    case 'top-left':
      return { top: `${offset}px`, left: `${offset}px`, right: 'auto', bottom: 'auto' };
    case 'top-right':
      return { top: `${offset}px`, right: `${offset}px`, left: 'auto', bottom: 'auto' };
    case 'bottom-left':
      return { bottom: `${offset}px`, left: `${offset}px`, right: 'auto', top: 'auto' };
    case 'bottom-right':
      return { bottom: `${offset}px`, right: `${offset}px`, left: 'auto', top: 'auto' };
    default:
      throw new Error(`Position "${position}" is not supported for detached glass.`);
  }
}
