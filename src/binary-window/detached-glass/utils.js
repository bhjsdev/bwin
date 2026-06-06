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
