import closeAction from './actions.close';
import minimizeAction from './actions.minimize';
import maximizeAction from './actions.maximize';
import { getMetricsFromElement } from '../utils';
import { getIntersectRect } from '../rect';
import { Position } from '../position';

export const BUILTIN_ACTIONS = [minimizeAction, maximizeAction, closeAction];

export default {
  enableActions() {
    this.handleMinimizedGlassClick();
    this.observeActionButtons();
  },

  restoreGlass(minimizedGlassEl) {
    const originalRect = minimizedGlassEl.bwOriginalBoundingRect;

    let biggestIntersectArea = 0;
    let targetPaneEl = null;

    this.windowElement.querySelectorAll('bw-pane').forEach((paneEl) => {
      const paneRect = getMetricsFromElement(paneEl);
      const intersectRect = getIntersectRect(originalRect, paneRect);

      if (intersectRect) {
        const intersectArea = intersectRect.width * intersectRect.height;

        if (intersectArea > biggestIntersectArea) {
          biggestIntersectArea = intersectArea;
          targetPaneEl = paneEl;
        }
      }
    });

    if (targetPaneEl) {
      const newPosition = minimizedGlassEl.bwOriginalPosition;
      const targetRect = getMetricsFromElement(targetPaneEl);
      const targetPaneSashId = targetPaneEl.getAttribute('sash-id');
      const targetPaneSash = this.rootSash.getById(targetPaneSashId);

      let newSize = 0;

      if (newPosition === Position.Left || newPosition === Position.Right) {
        newSize =
          targetRect.width - originalRect.width < targetPaneSash.minWidth
            ? targetRect.width / 2
            : originalRect.width;
      }
      else if (newPosition === Position.Top || newPosition === Position.Bottom) {
        newSize =
          targetRect.height - originalRect.height < targetPaneSash.minHeight
            ? targetRect.height / 2
            : originalRect.height;
      }
      else {
        throw new Error('[bwin] Invalid position when restoring glass');
      }

      const originalSashId = minimizedGlassEl.bwOriginalSashId;
      const newSashPane = this.addPane(targetPaneEl.getAttribute('sash-id'), {
        id: originalSashId,
        position: newPosition,
        size: newSize,
      });
      newSashPane.domNode.append(minimizedGlassEl.bwGlassElement);
    }
  },

  handleMinimizedGlassClick() {
    this.sillElement.addEventListener('click', (event) => {
      if (!event.target.matches('.bw-minimized-glass')) return;

      const minimizedGlassEl = event.target;
      this.restoreGlass(minimizedGlassEl);
      minimizedGlassEl.remove();
    });
  },

  updateDisabledStateOfActionButtons() {
    this.updateDisabledState('.bw-glass-action--close');
    this.updateDisabledState('.bw-glass-action--minimize');
    this.updateDisabledState('.bw-glass-action--maximize');
  },

  updateDisabledState(cssSelector) {
    const paneCount = this.windowElement.querySelectorAll('bw-pane').length;

    if (paneCount === 1) {
      const el = this.windowElement.querySelector(cssSelector);
      el && el.setAttribute('disabled', '');
    }
    else {
      this.windowElement.querySelectorAll(cssSelector).forEach((el) => {
        el.removeAttribute('disabled');
      });
    }
  },

  getMinimizedGlassElementBySashId(sashId) {
    const els = this.windowElement.querySelectorAll(`.bw-minimized-glass`);
    return Array.from(els).find((el) => el.bwOriginalSashId === sashId);
  },

  observeActionButtons() {
    this.updateDisabledStateOfActionButtons();

    const paneCountObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.updateDisabledStateOfActionButtons();
        }
      });
    });

    paneCountObserver.observe(this.windowElement, {
      childList: true,
    });
  },
};
