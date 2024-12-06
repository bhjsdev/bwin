import closeAction from './actions.close';
import minimizeAction from './actions.minimize';
import maximizeAction from './actions.maximize';
import { getMetricsFromElement } from '../utils';
import { getIntersectRect } from '../rect';

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
      const newSashPane = this.addPane(
        targetPaneEl.getAttribute('sash-id'),
        minimizedGlassEl.bwOriginalPosition
      );
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
