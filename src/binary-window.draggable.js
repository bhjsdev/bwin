import { getSashIdFromPane } from './frame.utils';
import { swapChildNodes } from './utils';

export default {
  activeDragGlassEl: null,
  // Stores original `can-drop` attribute value of pane element
  activeDragGlassPaneCanDrop: false,

  onPaneDrop(event, sash) {
    if (!this.activeDragGlassEl) return;
    const dropArea = this.activeDropPaneEl.getAttribute('drop-area');

    // Swap the content of the two panes
    if (dropArea === 'center') {
      const sourcePaneEl = this.activeDragGlassEl.closest('bw-pane');
      const activeDropPaneCanDrop = this.activeDropPaneEl.getAttribute('can-drop') !== 'false';

      swapChildNodes(sourcePaneEl, this.activeDropPaneEl);
      sourcePaneEl.setAttribute('can-drop', activeDropPaneCanDrop);

      return;
    }
    // Add the pane of glass next to the current pane
    else {
      const oldSashId = getSashIdFromPane(this.activeDragGlassEl);
      const newPaneSash = this.addPane(sash.id, dropArea);
      newPaneSash.domNode.append(this.activeDragGlassEl);

      this.removePane(oldSashId);
    }
  },

  enableDrag() {
    // Identify the glass element to be dragged
    // This prevents drag from being triggered by child elements, e.g. action buttons
    document.addEventListener('mousedown', (event) => {
      if (!event.target.matches('bw-glass-header')) return;
      if (event.target.getAttribute('can-drag') === 'false') return;

      const headerEl = event.target;
      const glassEl = headerEl.closest('bw-glass');
      glassEl.setAttribute('draggable', true);

      this.activeDragGlassEl = glassEl;
    });

    document.addEventListener('dragstart', (event) => {
      if (!event.target.matches('bw-glass')) return;
      if (!this.activeDragGlassEl) return;

      event.dataTransfer.effectAllowed = 'move';

      const paneEl = this.activeDragGlassEl.closest('bw-pane');
      this.activeDragGlassPaneCanDrop = paneEl.getAttribute('can-drop') !== 'false';
      paneEl.setAttribute('can-drop', false);
    });

    document.addEventListener('dragend', () => {
      if (this.activeDragGlassEl) {
        this.activeDragGlassEl.removeAttribute('draggable');
        // Carry over `can-drop` attribute
        this.activeDragGlassEl
          .closest('bw-pane')
          .setAttribute('can-drop', this.activeDragGlassPaneCanDrop);
        this.activeDragGlassEl = null;
      }
    });
  },
};
