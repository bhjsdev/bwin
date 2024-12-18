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
      let newSize = 0;

      if (newPosition === Position.Left || newPosition === Position.Right) {
        newSize =
          originalRect.width >= targetRect.width ? targetRect.width / 2 : originalRect.width;
      }
      else if (newPosition === Position.Top || newPosition === Position.Bottom) {
        newSize =
          originalRect.height >= targetRect.height ? targetRect.height / 2 : originalRect.height;
      }
      else {
        throw new Error('[bwin] Invalid position when restoring glass');
      }

      const newSashPane = this.addPane(targetPaneEl.getAttribute('sash-id'), {
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
