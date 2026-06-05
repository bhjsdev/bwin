import { getSashIdFromPane } from '../frame/frame-utils';
import { swapChildNodes } from '../utils';

export default {
  activeDragGlassEl: null,
  activeDragGlassPaneCanDrop: false,

  onPaneDrop(event, sash) {
    if (!this.activeDragGlassEl) return;
    const dropArea = this.activeDropPaneEl.getAttribute('drop-area');

    // Swap the content of the two panes
    if (dropArea === 'center') {
      const sourcePaneEl = this.activeDragGlassEl.closest('bw-pane');
      this.swapPanes(sourcePaneEl, this.activeDropPaneEl);

      return;
    }
    // Add the pane of glass next to the current pane, vertically or horizontally
    else {
      const oldSashId = getSashIdFromPane(this.activeDragGlassEl);
      this.removePane(oldSashId);

      const newPaneSash = this.addPane(sash.id, { position: dropArea, id: oldSashId });
      newPaneSash.domNode.append(this.activeDragGlassEl);
    }
  },

  enableDrag() {
    // Identify which "glass" element to be dragged
    // Prevent drag from being triggered by child elements, e.g. action buttons
    // It is possible to use `preventDefault` on `mousedown` if `event.target` is a child element
    // But it also prevents text from selection
    document.addEventListener('mousedown', (event) => {
      if (event.button !== 0 || !event.target.matches('bw-glass-header')) return;
      if (event.target.getAttribute('can-drag') === 'false') {
        // Chrome bug: use `event.preventDefault` to trigger `dragover` event
        // even if there's no `draggable` attribute set
        event.preventDefault();
        return;
      }

      const headerEl = event.target;
      const glassEl = headerEl.closest('bw-glass');
      glassEl.setAttribute('draggable', true);

      this.activeDragGlassEl = glassEl;
    });

    document.addEventListener('mouseup', () => {
      if (this.activeDragGlassEl) {
        this.activeDragGlassEl.removeAttribute('draggable');
        this.activeDragGlassEl = null;
      }
    });

    this.windowElement.addEventListener('dragstart', (event) => {
      if (
        !(event.target instanceof HTMLElement) ||
        !event.target.matches('bw-glass') ||
        !this.activeDragGlassEl
      ) {
        return;
      }

      event.dataTransfer.effectAllowed = 'move';

      const paneEl = this.activeDragGlassEl.closest('bw-pane');
      // Save original `can-drop` attribute for later carry-over
      this.activeDragGlassPaneCanDrop = paneEl.getAttribute('can-drop') !== 'false';
      paneEl.setAttribute('can-drop', false);
    });

    this.windowElement.addEventListener('dragend', () => {
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
