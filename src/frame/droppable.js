import { getCursorPosition } from '../position';

export default {
  activeDropPaneEl: null,

  // Intended to be overridden in `BinaryWindow` class
  onPaneDrop(event, sash) {},

  enableDrop() {
    this.windowElement.addEventListener('dragover', (event) => {
      // `preventDefault` is required to allow drop
      event.preventDefault();

      const paneEl = event.target.matches('bw-pane')
        ? event.target
        : event.target.closest('bw-pane');

      if (!paneEl) return;

      if (paneEl !== this.activeDropPaneEl) {
        if (this.activeDropPaneEl) {
          this.activeDropPaneEl.removeAttribute('drop-area');
        }
        this.activeDropPaneEl = paneEl;
      }

      if (paneEl.getAttribute('can-drop') === 'false') return;

      const position = getCursorPosition(paneEl, event);
      paneEl.setAttribute('drop-area', position);
    });

    this.windowElement.addEventListener('dragleave', (event) => {
      // Prevent `dragleave` from triggering on child elements in Chrome
      if (
        event.currentTarget.contains(event.relatedTarget) &&
        event.currentTarget !== event.relatedTarget
      ) {
        return;
      }

      if (this.activeDropPaneEl) {
        this.activeDropPaneEl.removeAttribute('drop-area');
        this.activeDropPaneEl = null;
      }
    });

    this.windowElement.addEventListener('drop', (event) => {
      if (!this.activeDropPaneEl) return;
      if (this.activeDropPaneEl.getAttribute('can-drop') === 'false') return;

      const sashId = this.activeDropPaneEl.getAttribute('sash-id');
      const sash = this.rootSash.getById(sashId);

      this.onPaneDrop(event, sash);

      if (typeof sash.store.onDrop === 'function') {
        sash.store.onDrop(event, sash);
      }

      this.activeDropPaneEl.removeAttribute('drop-area');
      this.activeDropPaneEl = null;
    });
  },
};
