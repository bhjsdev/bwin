import { getSashIdFromPane } from './frame.utils';
import { createDomNode } from './utils';

export const BUILTIN_ACTIONS = [
  {
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
      console.log(
        '🐞 -> minimizedGlassEl.bwPrevSiblingSashId:',
        minimizedGlassEl.bwPrevSiblingSashId
      );

      const glassEl = event.target.closest('bw-glass');
      minimizedGlassEl.bwGlassElement = glassEl;
    },
  },
  {
    label: '',
    className: 'bw-glass-action--maximize',
    onClick: (event) => {
      const paneEl = event.target.closest('bw-pane');

      if (paneEl.hasAttribute('maximized')) {
        paneEl.removeAttribute('maximized');
        paneEl.style.left = paneEl.bwOriginalBoundingBox.left;
        paneEl.style.top = paneEl.bwOriginalBoundingBox.top;
        paneEl.style.width = paneEl.bwOriginalBoundingBox.width;
        paneEl.style.height = paneEl.bwOriginalBoundingBox.height;
      }
      else {
        paneEl.setAttribute('maximized', '');
        paneEl.bwOriginalBoundingBox = {
          left: paneEl.style.left,
          top: paneEl.style.top,
          width: paneEl.style.width,
          height: paneEl.style.height,
        };
        paneEl.style.left = '0';
        paneEl.style.top = '0';
        paneEl.style.width = '100%';
        paneEl.style.height = '100%';
      }
    },
  },
  {
    label: '',
    className: 'bw-glass-action--close',
    onClick: (event, binaryWindow) => {
      const sashId = getSashIdFromPane(event.target);
      binaryWindow.removePane(sashId);
    },
  },
];
