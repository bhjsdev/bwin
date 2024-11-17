import { Frame } from './frame';
import { Glass } from './glass';

export class BinaryWindow extends Frame {
  onPaneCreate(paneEl, sash) {
    const glass = new Glass({ ...sash.store });

    paneEl.innerHTML = '';
    paneEl.append(glass.domNode);

    if (this.debug) {
      glass.contentElement.prepend(`[${sash.id}]`);
    }
  }

  onPaneUpdate() {
    // Do nothing
  }
}
