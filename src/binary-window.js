import { Layout, debug } from './layout';
import { genColor } from './utils';

const DEBUG = true;

export class BinaryWindow extends Layout {
  createPane(sash) {
    const paneEl = super.createPane(sash);

    if (DEBUG) {
      paneEl.style.backgroundColor = genColor();
      paneEl.appendChild(debug(paneEl));
    }

    return paneEl;
  }

  updatePane(sash) {
    super.updatePane(sash);

    if (DEBUG) {
      const paneEl = sash.element;
      paneEl.innerHTML = '';
      paneEl.appendChild(debug(paneEl));
    }
  }
}
