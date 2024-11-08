import { Frame } from './frame.js';

export class BinaryWindow extends Frame {
  // WARNING: Do not pass `sash-id` to child nodes.
  //          Because the child nodes can move around when add/remove panes.
  //          Instead, read parent pane's `sash-id` attribute.
  createPane(sash) {
    const paneEl = super.createPane(sash);

    const glassEl = this.createGlass(`${paneEl.getAttribute('sash-id')}`);
    paneEl.innerHTML = '';
    paneEl.append(glassEl);

    return paneEl;
  }

  createGlass(content) {
    const glassEl = document.createElement('bw-glass');
    const headerEl = document.createElement('bw-glass-header');
    const contentEl = document.createElement('bw-glass-content');

    contentEl.innerHTML = content || 'n/a';
    glassEl.append(headerEl, contentEl);
    return glassEl;
  }
}
