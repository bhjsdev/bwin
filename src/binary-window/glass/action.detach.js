const DETACHED_GLASS_INSET = 15;

export default {
  type: 'glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--detach',
  onClick: async (event, binaryWindow) => {
    const paneEl = event.target.closest('bw-pane');
    const paneSashId = paneEl.getAttribute('sash-id');
    const glassEl = paneEl.querySelector('bw-glass');
    const windowRect = binaryWindow.windowElement.getBoundingClientRect();
    const width = windowRect.width - DETACHED_GLASS_INSET * 2;
    const height = windowRect.height - DETACHED_GLASS_INSET * 2;

    const detachedGlassEl = await binaryWindow.addDetachedGlass({
      id: paneSashId + '-F',
      position: 'center',
      width,
      height,
      originalGlassElement: glassEl,
    });

    const paneSash = binaryWindow.rootSash.getById(paneSashId);
    const siblingSashId = paneSash.parent.getChildSiblingById(paneSashId).id;

    detachedGlassEl.bwOriginalSiblingSashId = siblingSashId;
    detachedGlassEl.bwOriginalPosition = paneEl.getAttribute('position');
    detachedGlassEl.bwOriginalRelativeSize = paneSash.getRelativeSize();

    binaryWindow.removePane(paneSashId);
    binaryWindow.emit('detach', detachedGlassEl);
  },
};
