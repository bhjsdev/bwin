import { createDomNode, getMetricsFromElement } from '../utils';

export default {
  label: '',
  className: 'bw-glass-action--minimize',
  onClick: (event, binaryWindow) => {
    const sillEl = binaryWindow.sillElement;
    if (!sillEl) throw new Error(`[bwin] Sill element not found when minimizing`);

    const minimizedGlassEl = createDomNode('<button class="bw-minimized-glass" />');
    sillEl.append(minimizedGlassEl);

    const paneEl = event.target.closest('bw-pane');
    const glassEl = event.target.closest('bw-glass');
    const paneSashId = paneEl.getAttribute('sash-id');
    const panePosition = paneEl.getAttribute('position');

    minimizedGlassEl.bwGlassElement = glassEl;
    minimizedGlassEl.bwOriginalPosition = panePosition;
    minimizedGlassEl.bwOriginalBoundingRect = getMetricsFromElement(paneEl);
    minimizedGlassEl.bwOriginalSashId = paneSashId;

    binaryWindow.removePane(paneSashId);
  },
};
