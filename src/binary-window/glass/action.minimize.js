import { createDomNode, getMetricsFromElement } from '@/utils';

export default {
  type: 'glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--minimize',
  onClick: (event, binaryWindow) => {
    const sillEl = binaryWindow.sillElement;
    if (!sillEl) throw new Error(`[bwin] Sill element not found when minimizing`);

    const potEl = createDomNode('<button class="bw-pot" bw-plant="glass" />');
    sillEl.append(potEl);

    const paneEl = event.target.closest('bw-pane');
    const glassEl = event.target.closest('bw-glass');
    const paneSashId = paneEl.getAttribute('sash-id');
    const panePosition = paneEl.getAttribute('position');

    potEl.bwGlassElement = glassEl;
    potEl.bwOriginalPosition = panePosition;
    potEl.bwOriginalBoundingRect = getMetricsFromElement(paneEl);
    potEl.bwOriginalSashId = paneSashId;

    binaryWindow.removePane(paneSashId);
  },
};
