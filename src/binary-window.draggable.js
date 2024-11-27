export default {
  activeDragPaneEl: null,
  activeDragPaneDroppable: true,

  enableDrag() {
    document.addEventListener('dragstart', (event) => {
      event.dataTransfer.effectAllowed = 'move';

      this.activeDragPaneEl = event.target.closest('bw-pane');
      this.activeDragPaneDroppable = this.activeDragPaneEl.getAttribute('droppable') !== 'false';

      this.activeDragPaneEl.setAttribute('droppable', false);
    });

    document.addEventListener('dragend', (event) => {
      this.activeDragPaneEl.setAttribute('droppable', this.activeDragPaneDroppable);
      this.activeDragPaneEl = null;
    });
  },
};
