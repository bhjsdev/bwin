import { getMetricsFromElement } from '@/utils';

export default {
  type: 'glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--maximize',
  onClick: (event, binaryWindow) => {
    const paneEl = event.target.closest('bw-pane');
    const glassEl = paneEl.querySelector('bw-glass');

    if (paneEl.hasAttribute('maximized')) {
      paneEl.removeAttribute('maximized');
      paneEl.style.left = `${paneEl.bwOriginalBoundingRect.left}px`;
      paneEl.style.top = `${paneEl.bwOriginalBoundingRect.top}px`;
      paneEl.style.width = `${paneEl.bwOriginalBoundingRect.width}px`;
      paneEl.style.height = `${paneEl.bwOriginalBoundingRect.height}px`;
      binaryWindow.emit('unmaximize', glassEl);
    }
    else {
      paneEl.setAttribute('maximized', '');
      paneEl.bwOriginalBoundingRect = getMetricsFromElement(paneEl);
      paneEl.style.left = '0';
      paneEl.style.top = '0';
      paneEl.style.width = '100%';
      paneEl.style.height = '100%';
      binaryWindow.emit('maximize', glassEl);
    }
  },
};
