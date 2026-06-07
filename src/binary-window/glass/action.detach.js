const DETACHED_GLASS_INSET = 15;

export default {
  label: '',
  className: 'bw-glass-action--detach',
  onClick: (event, binaryWindow) => {
    if (!binaryWindow.addDetachedGlass) throw new Error('[bwin] Failed to detach glass from pane');

    const paneEl = event.target.closest('bw-pane');
    const glassContentEl = paneEl.querySelector('bw-glass-content');
    const glassTitleEl = paneEl.querySelector('bw-glass-title');

    const windowRect = binaryWindow.windowElement.getBoundingClientRect();
    const width = windowRect.width - DETACHED_GLASS_INSET * 2;
    const height = windowRect.height - DETACHED_GLASS_INSET * 2;
    const detachedGlass = binaryWindow.addDetachedGlass({ position: 'center', width, height });

    const paneSashId = paneEl.getAttribute('sash-id');
    detachedGlass.domNode.bwOriginalPosition = paneSashId;
    detachedGlass.domNode.bwOriginalSashId = paneEl.getAttribute('position');

    detachedGlass.contentElement.replaceWith(glassContentEl);

    if (detachedGlass.titleElement) {
      detachedGlass.titleElement.replaceWith(glassTitleEl);
    }
    else {
      const titleEl = document.createElement('bw-glass-title');
      detachedGlass.headerElement.prepend(titleEl);
      titleEl.replaceWith(glassTitleEl);
    }

    binaryWindow.removePane(paneSashId);
  },
};
