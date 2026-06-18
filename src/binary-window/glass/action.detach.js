import { transferGlass } from './utils';

const DETACHED_GLASS_INSET = 15;

export default {
  type: 'glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-glass-action--detach',
  onClick: (event, binaryWindow) => {
    if (!binaryWindow.addDetachedGlass) throw new Error('[bwin] Failed to detach glass from pane');

    const paneEl = event.target.closest('bw-pane');
    const glassEl = paneEl.querySelector('bw-glass');

    const windowRect = binaryWindow.windowElement.getBoundingClientRect();
    const width = windowRect.width - DETACHED_GLASS_INSET * 2;
    const height = windowRect.height - DETACHED_GLASS_INSET * 2;
    const detachedGlass = binaryWindow.addDetachedGlass({ position: 'center', width, height });

    const paneSashId = paneEl.getAttribute('sash-id');
    const paneSash = binaryWindow.rootSash.getById(paneSashId);
    const siblingSashId = paneSash.parent.getChildSiblingById(paneSashId).id;

    detachedGlass.domNode.bwOriginalSiblingSashId = siblingSashId;
    detachedGlass.domNode.bwOriginalPosition = paneEl.getAttribute('position');
    detachedGlass.domNode.bwOriginalRelativeSize = paneSash.getRelativeSize();

    transferGlass(glassEl, detachedGlass.domNode);

    binaryWindow.removePane(paneSashId);
  },
};
