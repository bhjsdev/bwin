import { getCursorPosition } from './position';

export default {
  hoveredPaneEl: null,
  onDrop: () => {},

  enableDrop() {
    this.containerEl.addEventListener('dragover', (event) => {
      // `preventDefault` is required to allow drop
      event.preventDefault();

      const paneEl = event.target.matches('bw-pane')
        ? event.target
        : event.target.closest('bw-pane');

      if (!paneEl) return;

      if (paneEl !== this.hoveredPaneEl) {
        if (this.hoveredPaneEl) {
          this.hoveredPaneEl.removeAttribute('drop-area');
        }
        this.hoveredPaneEl = paneEl;
      }

      if (paneEl.getAttribute('droppable') === 'false') return;

      const position = getCursorPosition(paneEl, event);
      paneEl.setAttribute('drop-area', position);
    });

    this.containerEl.addEventListener('dragleave', (event) => {
      // Prevent `dragleave` from triggering on child elements in Chrome
      if (
        event.currentTarget.contains(event.relatedTarget) &&
        event.currentTarget !== event.relatedTarget
      ) {
        return;
      }

      if (this.hoveredPaneEl) {
        this.hoveredPaneEl.removeAttribute('drop-area');
        this.hoveredPaneEl = null;
      }
    });

    this.containerEl.addEventListener('drop', (event) => {
      if (!this.hoveredPaneEl) return;
      if (this.hoveredPaneEl.getAttribute('droppable') === 'false') return;

      if (typeof this.onDrop === 'function') {
        const sashId = this.hoveredPaneEl.getAttribute('sash-id');
        const sash = this.rootSash.getById(sashId);
        this.onDrop(event, sash);
      }

      this.hoveredPaneEl.removeAttribute('drop-area');
      this.hoveredPaneEl = null;
    });
  },
};
