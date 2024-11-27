export default {
  activeDragGlassEl: null,
  // Stores original value of pane's can-drop attribute
  activeDragGlassPaneCanDrop: false,

  onPaneDrop(event, sash) {
    // todo: implement
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

      event.dataTransfer.effectAllowed = 'move';

      const paneEl = event.target.closest('bw-pane');
      this.activeDragGlassPaneCanDrop = paneEl.getAttribute('droppable') !== 'false';

      paneEl.setAttribute('can-drop', false);
    });

    document.addEventListener('dragend', () => {
      if (this.activeDragGlassEl) {
        this.activeDragGlassEl.removeAttribute('draggable');

        const paneEl = this.activeDragGlassEl.closest('bw-pane');
        paneEl.setAttribute('can-drop', this.activeDragGlassPaneCanDrop);

        this.activeDragGlassEl = null;
      }
    });
  },
};
