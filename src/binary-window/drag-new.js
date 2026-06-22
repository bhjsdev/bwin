import { getIntersectRect } from '@/rect';
import { transferGlass } from './glass/utils';

// At/above this overlap with its origin, a released glass is read as "didn't mean
// to move it" and snaps back. Below it, the detach commits.
const SNAP_BACK_OVERLAP_RATIO = 0.9;

// Dims the origin glass in place (not hidden) while its content floats detached.
const DRAGGING_ORIGIN_CLASS = 'bw-glass--dimmed';

// Detach mode: a pointer drag on an attached glass header peels it into a temporary
// detached glass that mirrors the origin exactly. Releasing while still mostly
// overlapping the origin snaps back; dragging clear commits the detach and lets the
// sibling pane reclaim the space.
export default {
  enableGlassDetachDrag() {
    let originGlassEl = null;
    let originPaneSashId = null;
    let detachedGlassEl = null;
    let detachedHeaderEl = null;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      // Drag from the header, but not its buttons or the attach indicator.
      const headerEl = event.target.closest('bw-glass-header');
      if (!headerEl || event.target.closest('bw-action-bar, bw-attach-indicator')) return;
      if (headerEl.getAttribute('can-drag') === 'false') return;

      // Attached glass only — detached glass moving is handled elsewhere.
      const glassEl = headerEl.closest('bw-glass:not([detached])');
      if (!glassEl) return;

      const paneEl = glassEl.closest('bw-pane');
      if (!paneEl) return;

      event.preventDefault();

      // Capture the origin geometry (window-relative) before mutating anything.
      const windowRect = this.windowElement.getBoundingClientRect();
      const glassRect = glassEl.getBoundingClientRect();
      const left = glassRect.left - windowRect.left;
      const top = glassRect.top - windowRect.top;

      // Mirror the origin glass exactly so overlap starts at ~100%.
      const detached = this.addDetachedGlass({
        position: 'top-left',
        offsetX: left,
        offsetY: top,
        width: glassRect.width,
        height: glassRect.height,
        animateOpen: false,
      });

      originGlassEl = glassEl;
      originPaneSashId = paneEl.getAttribute('sash-id');
      detachedGlassEl = detached.domNode;
      detachedHeaderEl = detached.headerElement;

      // Stamp origin so the attach action can re-dock to the same spot (see action.detach.js).
      const paneSash = this.rootSash.getById(originPaneSashId);
      detachedGlassEl.bwOriginalSiblingSashId =
        paneSash.parent.getChildSiblingById(originPaneSashId).id;
      detachedGlassEl.bwOriginalPosition = paneEl.getAttribute('position');
      detachedGlassEl.bwOriginalRelativeSize = paneSash.getRelativeSize();

      transferGlass(originGlassEl, detachedGlassEl);
      // Dim (not hide) the origin so its place stays visible until snap-back vs commit.
      originGlassEl.classList.add(DRAGGING_ORIGIN_CLASS);

      startX = event.pageX;
      startY = event.pageY;
      startLeft = left;
      startTop = top;

      // setPointerCapture keeps move events flowing when the pointer leaves the header.
      detachedHeaderEl.setPointerCapture(event.pointerId);
    });

    this.windowElement.addEventListener('pointermove', (event) => {
      if (!detachedGlassEl) return;

      const left = startLeft + (event.pageX - startX);
      const top = startTop + (event.pageY - startY);

      detachedGlassEl.style.right = 'auto';
      detachedGlassEl.style.bottom = 'auto';
      detachedGlassEl.style.left = `${left}px`;
      detachedGlassEl.style.top = `${top}px`;
    });

    this.windowElement.addEventListener('pointerup', (event) => {
      if (!detachedGlassEl) return;

      if (detachedHeaderEl.hasPointerCapture?.(event.pointerId)) {
        detachedHeaderEl.releasePointerCapture(event.pointerId);
      }

      const originRect = originGlassEl.getBoundingClientRect();
      const floatRect = detachedGlassEl.getBoundingClientRect();
      const intersectRect = getIntersectRect(originRect, floatRect);
      const intersectArea = intersectRect ? intersectRect.width * intersectRect.height : 0;
      const floatArea = floatRect.width * floatRect.height;
      const overlapRatio = floatArea > 0 ? intersectArea / floatArea : 0;

      if (overlapRatio >= SNAP_BACK_OVERLAP_RATIO) {
        // Barely moved → undo the peel.
        transferGlass(detachedGlassEl, originGlassEl);
        originGlassEl.classList.remove(DRAGGING_ORIGIN_CLASS);
        this.removeDetachedGlass(detachedGlassEl.id);
      }
      else {
        // Real detach → drop the origin pane so the sibling reclaims the space.
        this.removePane(originPaneSashId);
      }

      originGlassEl = null;
      originPaneSashId = null;
      detachedGlassEl = null;
      detachedHeaderEl = null;
    });
  },
};
