import { Frame } from './frame.js';

export class BinaryWindow extends Frame {
  // WARNING: Do not pass `sash-id` to child nodes.
  //          Because the child nodes can move around when add/remove panes.
  //          Instead, read parent pane's `sash-id` attribute.
  createPane(sash, fromPaneEl) {
    const paneEl = super.createPane(sash, fromPaneEl);

    if (!fromPaneEl) {
      const headerEl = this.createPaneHeader();
      paneEl.appendChild(headerEl);

      const contentEl = this.createPaneContent();
      paneEl.appendChild(contentEl);

      contentEl.innerHTML = `ID: ${paneEl.getAttribute('sash-id')}`;
    }

    paneEl.style.border = '1px solid black';

    return paneEl;
  }

  createPaneHeader() {
    return document.createElement('pane-header');
  }

  createPaneContent() {
    return document.createElement('pane-content');
  }
}
