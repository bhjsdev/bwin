import { transferGlass } from './utils';

const DETACHED_GLASS_INSET = 15;

export default {
  type: 'glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--detach',
  onClick: (event, binaryWindow) => {
    if (!binaryWindow.addDetachedGlass) throw new Error('[bwin] Failed to detach glass from pane');

    const paneEl = event.target.closest('bw-pane');
    const glassEl = paneEl.querySelector('bw-glass');

    const windowRect = binaryWindow.windowElement.getBoundingClientRect();
    const width = windowRect.width - DETACHED_GLASS_INSET * 2;
    const height = windowRect.height - DETACHED_GLASS_INSET * 2;
    const detachedGlassEl = binaryWindow.addDetachedGlass({ position: 'center', width, height });

    const paneSashId = paneEl.getAttribute('sash-id');
    const paneSash = binaryWindow.rootSash.getById(paneSashId);
    const siblingSashId = paneSash.parent.getChildSiblingById(paneSashId).id;

    detachedGlassEl.bwOriginalSiblingSashId = siblingSashId;
    detachedGlassEl.bwOriginalPosition = paneEl.getAttribute('position');
    detachedGlassEl.bwOriginalRelativeSize = paneSash.getRelativeSize();

    transferGlass(glassEl, detachedGlassEl);

    binaryWindow.removePane(paneSashId);
  },
};
