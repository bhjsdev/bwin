import { MoveController } from '@/move-controller';
import { getResizeHandleOverhang } from './utils';

export default {
  enableDetachedGlassMove() {
    const moveController = new MoveController();

    document.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      // Move from anywhere in the header (incl. title text), but not its buttons.
      const headerEl = event.target.closest('bw-glass-header');
      const canDrag =
        !!headerEl &&
        !event.target.closest('button') &&
        headerEl.getAttribute('can-drag') !== 'false';

      const glassEl = canDrag ? headerEl.closest('bw-glass[detached]') : null;
      if (!glassEl) return;

      moveController.setTarget(glassEl, {
        edgeReserve: getResizeHandleOverhang(glassEl),
      });
    });

    // Enable last: our listener above and the controller's pointerdown are both
    // bubble-phase on `document`, so registration order decides. Registering the
    // controller after our listener lets us resolve the target before it reads it.
    moveController.enable();
  },
};
