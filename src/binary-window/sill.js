import { getMetricsFromElement } from '@/utils';
import { getIntersectRect } from '@/rect';
import { Position } from '@/position';
import { detachedGlassManager } from './detached-glass/manager';
import { animateDetachedGlassOpen } from './detached-glass/utils';

export default {
  enableSillFeatures() {
    this.enableUnpotGlass();
    this.enableUnpotDetachedGlass();
  },

  enableUnpotGlass() {
    this.sillElement.addEventListener('click', (event) => {
      if (!event.target.matches('.bw-pot[bw-plant="glass"]')) return;

      const potEl = event.target;
      this.unpotGlass(potEl);
      potEl.remove();
    });
  },

  // Un-pot a minimized detached glass: un-hide it, drop its sill pot, raise it.
  // Keyed on bwDetachedGlassElement so it ignores tiled glasses' pots.
  enableUnpotDetachedGlass() {
    this.sillElement.addEventListener('click', (event) => {
      const potEl = event.target;
      if (!potEl.matches('.bw-pot[bw-plant="detached-glass"]')) return;

      const detachedGlassEl = potEl.bwDetachedGlassElement;
      if (!detachedGlassEl) return;

      detachedGlassEl.style.display = '';
      animateDetachedGlassOpen(detachedGlassEl);
      potEl.remove();
      detachedGlassManager.bringToFront(detachedGlassEl);
    });
  },

  unpotGlass(potEl) {
    const originalRect = potEl.bwOriginalBoundingRect;

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
      const newPosition = potEl.bwOriginalPosition;
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

      const originalSashId = potEl.bwOriginalSashId;
      const newSashPane = this.addPane(targetPaneEl.getAttribute('sash-id'), {
        id: originalSashId,
        position: newPosition,
        size: newSize,
        withGlass: false,
      });
      newSashPane.domNode.append(potEl.bwGlassElement);
    }
  },

  getPotElementBySashId(sashId) {
    const els = this.windowElement.querySelectorAll(`.bw-pot[bw-plant="glass"]`);
    return Array.from(els).find((el) => el.bwOriginalSashId === sashId);
  },
};
