import { getMetricsFromElement } from '@/utils';
import { getIntersectRect } from '@/rect';
import { Position } from '@/position';

export default {
  enableGlassActions() {
    this.handleMinimizedGlassClick();
    this.observeActionButtons();
    this.dismissActionListMenuOnPointerDown();
  },

  // Dismiss the open action list menu when pressing elsewhere (dragging muntins,
  // glass headers, etc). Pointerdowns inside the action list are left alone so
  // the popover's own toggle/light-dismiss handles the trigger and menu items.
  dismissActionListMenuOnPointerDown() {
    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.target.closest('bw-glass-action-list')) return;

      this.windowElement
        .querySelectorAll('bw-glass-action-list-menu:popover-open')
        .forEach((menuEl) => menuEl.hidePopover());
    });
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
        withGlass: false,
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
    this.updateDisabledState('.bw-glass-action--detach');
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

  // Re-sync action button disabled state whenever panes are added/removed,
  // so the last remaining pane can't be closed/minimized/maximized.
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
