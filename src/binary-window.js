import { Frame } from './frame';
import { Glass } from './glass';
import binaryWindowObservers from './binary-window.observers';
import binaryWindowDraggable from './binary-window.draggable';

export class BinaryWindow extends Frame {
  mount(containerEl) {
    super.mount(containerEl);

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

  trimMuntin(muntinEl) {
    if (muntinEl.hasAttribute('vertical')) {
      muntinEl.style.top = `${parseFloat(muntinEl.style.top) + this.muntinSize / 2}px`;
      muntinEl.style.height = `${parseFloat(muntinEl.style.height) - this.muntinSize}px`;
    }
    else if (muntinEl.hasAttribute('horizontal')) {
      muntinEl.style.left = `${parseFloat(muntinEl.style.left) + this.muntinSize / 2}px`;
      muntinEl.style.width = `${parseFloat(muntinEl.style.width) - this.muntinSize}px`;
    }
  }

  onMuntinCreate(muntinEl) {
    this.trimMuntin(muntinEl);
  }

  onMuntinUpdate(muntinEl) {
    this.trimMuntin(muntinEl);
  }
}

BinaryWindow.assemble(binaryWindowObservers, binaryWindowDraggable);
