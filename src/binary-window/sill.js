import { getMetricsFromElement } from '@/utils';
import { getIntersectRect } from '@/rect';
import { Position } from '@/position';
import { animateElementByAttribute } from '@/animate';
import { Glass } from './glass';

export default {
  enableSillFeatures() {
    this.enableUnpotGlass();
    this.enableUnpotDetachedGlass();
    this.renderPots(this.pots, this.sillElement);
  },

  renderPots(pots, sillEl) {
    if (!pots || pots.length === 0) return;

    for (const pot of pots) {
      const { originalSashId, originalPosition, originalBoundingRect, plant, ...glassProps } = pot;
      const buttonEl = document.createElement('button');
      buttonEl.classList.add('bw-pot');
      buttonEl.setAttribute('bw-plant', plant);
      buttonEl.bwOriginalSashId = originalSashId;
      buttonEl.bwOriginalPosition = originalPosition;
      buttonEl.bwOriginalBoundingRect = originalBoundingRect;

      buttonEl.bwGlassElement = new Glass({
        actions: this.actions[0],
        ...glassProps,
        binaryWindow: this,
      }).domNode;

      sillEl.append(buttonEl);
    }
  },

  createPotConfig() {
    const potEls = this.sillElement.querySelectorAll('.bw-pot');
    const pots = Array.from(potEls).map((potEl) => {
      return {
        originalSashId: potEl.bwOriginalSashId,
        originalPosition: potEl.bwOriginalPosition,
        originalBoundingRect: potEl.bwOriginalBoundingRect,
        plant: potEl.getAttribute('bw-plant'),
      };
    });

    return pots;
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

      animateElementByAttribute(detachedGlassEl, 'opening', () => {
        potEl.remove();
        this.detachedGlassManager.bringToFront(detachedGlassEl);
        this.emit('restore', detachedGlassEl);
      });
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
      this.emit('restore', potEl.bwGlassElement);
    }
  },

  getPotElementBySashId(sashId) {
    const els = this.windowElement.querySelectorAll(`.bw-pot[bw-plant="glass"]`);
    return Array.from(els).find((el) => el.bwOriginalSashId === sashId);
  },
};
