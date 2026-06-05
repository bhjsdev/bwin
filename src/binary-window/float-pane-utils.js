import floatPane from './float-pane';
import { genId } from '../utils';

// TODO: position can be 'center', 'top-left', 'top-center', 'top-right', etc
export function createFloatPaneElement({ width, height, offset, position, id }) {
  const floatPaneEl = document.createElement('bw-float-pane');
  floatPaneEl.style.position = 'absolute';

  if (position === 'top-right') {
    floatPaneEl.style.top = `${offset}px`;
    floatPaneEl.style.right = `${offset}px`;
    floatPaneEl.style.width = `${width}px`;
    floatPaneEl.style.height = `${height}px`;
  }

  floatPaneEl.style.backgroundColor = 'pink';
  floatPaneEl.style.opacity = '0.95';

  // Generate an ID like "AB-123-F" to diff from Sash IDs
  floatPaneEl.setAttribute('id', id || genId() + '-F');
  floatPaneEl.setAttribute('active', 'true');

  return floatPaneEl;
}
