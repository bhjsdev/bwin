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
      const {
        plant,
        originalSashId,
        originalPosition,
        originalBoundingRect,
        originalDetachedGlassId,
        originalDetachedGlassBoundingRect,
        ...glassProps
      } = pot;

      const buttonEl = document.createElement('button');
      buttonEl.classList.add('bw-pot');
      buttonEl.setAttribute('bw-plant', plant);

      if (plant === 'glass') {
        // Glass pot
        buttonEl.bwOriginalSashId = originalSashId;
        buttonEl.bwOriginalPosition = originalPosition;
        buttonEl.bwOriginalBoundingRect = originalBoundingRect;
        buttonEl.bwGlassElement = new Glass({
          actions: this.actions[0],
          ...glassProps,
          binaryWindow: this,
        }).domNode;
      }
      else if (plant === 'detached-glass') {
        // Detached glass pot
        const detachedGlassEl = this.detachedGlassManager.addDetachedGlass({
          actions: this.actions[1],
          id: originalDetachedGlassId,
          ...originalDetachedGlassBoundingRect,
          ...glassProps,
          minimized: true,
          binaryWindow: this,
        });

        buttonEl.bwDetachedGlassElement = detachedGlassEl;
        // Add to window but minimized so it doesn't show until un-potted
        this.windowElement.append(detachedGlassEl);
      }

      sillEl.append(buttonEl);
    }
  },

  createPotConfig() {
    const potEls = this.sillElement.querySelectorAll('.bw-pot');
    const pots = Array.from(potEls).map((potEl) => {
      return {
        plant: potEl.getAttribute('bw-plant'),
        // Glass content
        originalSashId: potEl.bwOriginalSashId,
        originalPosition: potEl.bwOriginalPosition,
        originalBoundingRect: potEl.bwOriginalBoundingRect,
        // Detached glass content
        originalDetachedGlassId: potEl.bwDetachedGlassElement?.getAttribute('id'),
        // Get raw string values
        originalDetachedGlassBoundingRect: {
          top: potEl.bwDetachedGlassElement?.style.top,
          left: potEl.bwDetachedGlassElement?.style.left,
          width: potEl.bwDetachedGlassElement?.style.width,
          height: potEl.bwDetachedGlassElement?.style.height,
        },
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

      detachedGlassEl.removeAttribute('minimized');

      // TODO: animate with a scale transform from the pot's position to the detached glass's position.
      // Just the opposite of the animation in Glass.js when minimizing a detached glass.
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
