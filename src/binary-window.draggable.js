export default {
  activeDragPaneEl: null,
  activeDragPaneDroppable: true,

  enableDrag() {
    document.addEventListener('dragstart', (event) => {
      if (!event.target.matches('bw-glass-header')) return;

      event.dataTransfer.effectAllowed = 'move';

      this.activeDragPaneEl = event.target.closest('bw-pane');
      this.activeDragPaneDroppable = this.activeDragPaneEl.getAttribute('droppable') !== 'false';

      this.activeDragPaneEl.setAttribute('droppable', false);
    });

    document.addEventListener('dragend', (event) => {
      if (this.activeDragPaneEl) {
        this.activeDragPaneEl.setAttribute('droppable', this.activeDragPaneDroppable);
        this.activeDragPaneEl = null;
      }
    });
  },
};
