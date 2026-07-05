import { MoveController } from '../../src/move-controller';

const boxEl = document.querySelector('#box');
const aEl = document.querySelector('#a');
const bEl = document.querySelector('#b');

// One shared controller for all three boxes; no lifecycle hooks for now.
const moveController = new MoveController();
moveController.enable();

// Set on pointerdown (target phase) so it's in place before the controller's
// document-level handler runs on the bubble phase.
boxEl.addEventListener('pointerdown', () => moveController.setTarget(boxEl)); // moves itself
aEl.addEventListener('pointerdown', () => moveController.setTarget(bEl)); // A drags B
bEl.addEventListener('pointerdown', () => moveController.setTarget(aEl)); // B drags A

// Clean up so a press on empty space doesn't drag the last target.
document.addEventListener('pointerup', () => moveController.setTarget(null));
