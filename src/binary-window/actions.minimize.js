import { createDomNode } from '../utils';

export default {
  label: '',
  className: 'bw-glass-action--minimize',
  onClick: (event, binaryWindow) => {
    const sillEl = binaryWindow.sillElement;
    if (!sillEl) throw new Error(`[bwin] Sill element not found when minimizing`);

    const minimizedGlassEl = createDomNode('<button class="bw-minimized-glass" />');
    sillEl.append(minimizedGlassEl);

    const paneEl = event.target.closest('bw-pane');
    const paneSashId = paneEl.getAttribute('sash-id');
    const panePosition = paneEl.getAttribute('position');

    minimizedGlassEl.bwPrevSelfPosition = panePosition;
    minimizedGlassEl.bwPrevSiblingSashId = binaryWindow.removePane(paneSashId);

    const glassEl = event.target.closest('bw-glass');
    minimizedGlassEl.bwGlassElement = glassEl;
  },
};
