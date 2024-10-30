import { Frame } from './frame.js';

export class BinaryWindow extends Frame {
  // WARNING: Do not pass `sash-id` to child nodes.
  //          Because the child nodes can move around when add/remove panes.
  //          Instead, read parent pane's `sash-id` attribute.
  createPane(sash, fromPaneEl) {
    const paneEl = super.createPane(sash, fromPaneEl);

    if (!fromPaneEl) {
      const glassEl = this.createGlass(`${paneEl.getAttribute('sash-id')}`);
      paneEl.append(glassEl);
    }

    paneEl.style.border = '1px solid black';

    return paneEl;
  }

  createGlass(content) {
    const glassEl = document.createElement('bw-glass');
    const headerEl = document.createElement('bw-glass-header');
    const contentEl = document.createElement('bw-glass-content');

    contentEl.innerHTML = content || 'Glass content';
    glassEl.append(headerEl, contentEl);
    return glassEl;
  }
}
