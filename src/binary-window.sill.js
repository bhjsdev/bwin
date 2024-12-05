import { createDomNode } from './utils';

export default {
  sillElement: null,

  enableSill() {
    const sillEl = createDomNode('<bw-sill />');
    this.windowElement.append(sillEl);
    this.sillElement = sillEl;

    this.sillElement.addEventListener('click', (event) => {
      if (!event.target.matches('.bw-minimized-glass')) return;

      const minimizedGlassEl = event.target;
      const prevSiblingSash = this.rootSash.getById(minimizedGlassEl.bwPrevSiblingSashId);

      if (prevSiblingSash && prevSiblingSash.children.length === 0) {
        const newPaneSash = this.addPane(
          minimizedGlassEl.bwPrevSiblingSashId,
          minimizedGlassEl.bwPrevSelfPosition
        );

        newPaneSash.domNode.append(minimizedGlassEl.bwGlassElement);
      }
      else {
        // Add the glass to a random pane. To be improved
        const randomPaneEl = this.windowElement.querySelector('bw-pane');
        const randomPaneSashId = randomPaneEl.getAttribute('sash-id');
        const newSashPane = this.addPane(randomPaneSashId, 'right');

        newSashPane.domNode.append(minimizedGlassEl.bwGlassElement);
      }

      minimizedGlassEl.remove();
    });
  },
};
