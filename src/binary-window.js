import { Frame } from './frame';
import { Glass } from './glass';
import binaryWindowObservers from './binary-window.observers';
import binaryWindowDraggable from './binary-window.draggable';
import binaryWindowTrim from './binary-window.trim';

export class BinaryWindow extends Frame {
  sillElement = null;

  enableFeatures() {
    super.enableFeatures();

    this.enableObservers();
    this.enableDrag();
  }

  onPaneCreate(paneEl, sash) {
    const glass = new Glass({ ...sash.store, sash, binaryWindow: this });

    paneEl.innerHTML = '';
    paneEl.append(glass.domNode);

    if (this.debug) {
      glass.contentElement.prepend(`${sash.id}`);
    }
  }

  onPaneUpdate() {
    // Overriding Frame's debug pane update
  }

  /**
   * Add glass into the target pane.
   *
   * @param {string} paneSashId - The Sash ID of the pane that the glass moves into
   * @param {'top'|'right'|'bottom'|'left'} position - The position of the glass relative to the target pane
   * @param {Object} glassProps - The glass properties
   *
   */
  addGlass(paneSashId, position, glassProps) {
    const paneSash = this.addPane(paneSashId, position);
    const glass = new Glass({ ...glassProps, sash: paneSash, binaryWindow: this });
    paneSash.domNode.append(glass.domNode);
  }

  /**
   * Remove glass from or together with the pane
   *
   * @param {string} paneSashId - The Sash ID of the pane that contains the glass
   * @param {boolean} removePane - Whether to remove the pane together
   */
  removeGlass(paneSashId, removePane) {
    if (removePane) {
      this.removePane(paneSashId);
    }
    else {
      const paneSash = this.rootSash.getById(paneSashId);
      if (!paneSash) throw new Error(`[bwin] Pane not found when removing glass`);

      const glassEl = paneSash.domNode.querySelector('bw-glass');
      if (glassEl) glassEl.remove();
    }
  }
}

BinaryWindow.assemble(binaryWindowObservers, binaryWindowDraggable, binaryWindowTrim);
