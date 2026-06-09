// Native drag is one document-global gesture, so this state is module-level:
// only one glass can be dragged at a time anyway.
let activeDragGlassEl = null;
// Pointer offset within the glass at grab time, so it lands where it was grabbed.
let dragOffsetX = 0;
let dragOffsetY = 0;

export default {
  // The glass stays put during the drag; the final left/top is applied on dragend.
  enableDetachedGlassDrag() {
    document.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return;

      // Drag from anywhere in the header (incl. title text), but not its buttons.
      const headerEl = event.target.closest('bw-glass-header');
      if (!headerEl || event.target.closest('button')) return;
      if (headerEl.getAttribute('can-drag') === 'false') return;

      const glassEl = headerEl.closest('bw-glass[detached]');
      if (!glassEl) return;

      glassEl.setAttribute('draggable', true);
      activeDragGlassEl = glassEl;
    });

    // Click without a drag: clear the draggable flag set on mousedown.
    // A real drag fires dragend instead of mouseup.
    document.addEventListener('mouseup', () => {
      if (activeDragGlassEl) {
        activeDragGlassEl.removeAttribute('draggable');
        activeDragGlassEl = null;
      }
    });

    this.windowElement.addEventListener('dragstart', (event) => {
      if (!activeDragGlassEl) return;

      event.dataTransfer.effectAllowed = 'move';

      const glassRect = activeDragGlassEl.getBoundingClientRect();
      dragOffsetX = event.clientX - glassRect.left;
      dragOffsetY = event.clientY - glassRect.top;
    });

    this.windowElement.addEventListener('dragend', (event) => {
      if (!activeDragGlassEl) return;

      const windowRect = this.windowElement.getBoundingClientRect();
      const left = event.clientX - windowRect.left - dragOffsetX;
      const top = event.clientY - windowRect.top - dragOffsetY;

      activeDragGlassEl.style.right = 'auto';
      activeDragGlassEl.style.bottom = 'auto';
      activeDragGlassEl.style.left = `${left}px`;
      activeDragGlassEl.style.top = `${top}px`;

      activeDragGlassEl.removeAttribute('draggable');
      activeDragGlassEl = null;
    });
  },
};
