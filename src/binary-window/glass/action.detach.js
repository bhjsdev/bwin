const DETACHED_GLASS_INSET = 15;

export default {
  label: '',
  className: 'bw-glass-action--detach',
  onClick: (event, binaryWindow) => {
    if (!binaryWindow.addDetachedGlass) throw new Error('[bwin] Failed to detach glass from pane');

    const paneEl = event.target.closest('bw-pane');
    const paneSashId = paneEl.getAttribute('sash-id');
    const paneSash = binaryWindow.rootSash.getById(paneSashId);

    const windowRect = binaryWindow.windowElement.getBoundingClientRect();
    const width = windowRect.width - DETACHED_GLASS_INSET * 2;
    const height = windowRect.height - DETACHED_GLASS_INSET * 2;

    // Build from the sash store (source of truth). Drop `actions` so the detached glass
    // uses its own defaults (attach/minimize/close), not the attached glass's actions.
    // The live content/title wrappers in the store are adopted into the detached glass.
    const { actions, ...glassStore } = paneSash.store;
    const detachedGlass = binaryWindow.addDetachedGlass({ position: 'center', width, height, ...glassStore });

    const siblingSashId = paneSash.parent.getChildSiblingById(paneSashId).id;
    detachedGlass.domNode.bwOriginalSiblingSashId = siblingSashId;
    detachedGlass.domNode.bwOriginalPosition = paneEl.getAttribute('position');
    detachedGlass.domNode.bwOriginalRelativeSize = paneSash.getRelativeSize();
    // Stash the full original store so attach can restore the glass faithfully.
    detachedGlass.domNode.bwStore = paneSash.store;

    binaryWindow.removePane(paneSashId);
  },
};
