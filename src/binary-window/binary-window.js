import { Frame } from '../frame/frame';
import { Glass } from './glass';
import { createDomNode } from '../utils';
import draggableModule from './draggable';
import trimModule from './trim';
import actionsModule from './actions';

export class BinaryWindow extends Frame {
  sillElement = null;

  frame() {
    super.frame(...arguments);
    const sillEl = createDomNode('<bw-sill />');
    this.windowElement.append(sillEl);
    this.sillElement = sillEl;
  }

  enableFeatures() {
    super.enableFeatures();
    this.enableDrag();
    this.enableActions();
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
   * Add a pane with glass into the target pane.
   *
   * @param {string} targetPaneId - The Sash ID of the target pane
   * @param {Object} props - The pane and glass properties grouped together
   * @returns {Sash} - The newly created Sash
   */
  addPane(targetPaneId, props) {
    const { position, size, ...glassProps } = props;
    const paneSash = super.addPane(targetPaneId, { position, size });
    const glass = new Glass({ ...glassProps, sash: paneSash, binaryWindow: this });
    paneSash.domNode.append(glass.domNode);
    return paneSash;
  }
}

BinaryWindow.assemble(draggableModule, trimModule, actionsModule);
