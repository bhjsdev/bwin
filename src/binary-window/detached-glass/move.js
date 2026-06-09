export default {
  enableDetachedGlassMove() {
    let activeMoveGlassEl = null;
    let moveStartX = 0;
    let moveStartY = 0;
    let moveStartLeft = 0;
    let moveStartTop = 0;

    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      // Move from anywhere in the header (incl. title text), but not its buttons.
      const headerEl = event.target.closest('bw-glass-header');
      if (!headerEl || event.target.closest('button')) return;
      if (headerEl.getAttribute('can-drag') === 'false') return;

      const glassEl = headerEl.closest('bw-glass[detached]');
      if (!glassEl) return;

      event.preventDefault();
      // setPointerCapture keeps move events flowing when the pointer leaves the header.
      headerEl.setPointerCapture(event.pointerId);

      activeMoveGlassEl = glassEl;
      moveStartX = event.pageX;
      moveStartY = event.pageY;

      // Normalize corner-anchored geometry to window-relative left/top.
      const windowRect = this.windowElement.getBoundingClientRect();
      const glassRect = glassEl.getBoundingClientRect();
      moveStartLeft = glassRect.left - windowRect.left;
      moveStartTop = glassRect.top - windowRect.top;
    });

    this.windowElement.addEventListener('pointermove', (event) => {
      if (!activeMoveGlassEl) return;

      const left = moveStartLeft + (event.pageX - moveStartX);
      const top = moveStartTop + (event.pageY - moveStartY);

      activeMoveGlassEl.style.right = 'auto';
      activeMoveGlassEl.style.bottom = 'auto';
      activeMoveGlassEl.style.left = `${left}px`;
      activeMoveGlassEl.style.top = `${top}px`;
    });

    this.windowElement.addEventListener('pointerup', (event) => {
      if (!activeMoveGlassEl) return;

      if (event.target.hasPointerCapture?.(event.pointerId)) {
        event.target.releasePointerCapture(event.pointerId);
      }

      activeMoveGlassEl = null;
    });
  },
};
