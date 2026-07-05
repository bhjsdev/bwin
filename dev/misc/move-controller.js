import { MoveController } from '../../src/move-controller';

const boxEl = document.querySelector('#box');
const aEl = document.querySelector('#a');
const bEl = document.querySelector('#b');

// One shared controller for all three boxes; no lifecycle hooks for now.
const moveController = new MoveController();
moveController.enable();

// #box needs no listener: with no target set, the controller falls back to the
// pressed element, so it drags itself. A/B override that to move the other box.
// Set on pointerdown (target phase) so it's in place before the controller's
// document-level handler runs on the bubble phase.
aEl.addEventListener('pointerdown', () => moveController.setTarget(bEl)); // A drags B
bEl.addEventListener('pointerdown', () => moveController.setTarget(aEl)); // B drags A

document.querySelector('#enable').addEventListener('click', () => moveController.enable());
document.querySelector('#disable').addEventListener('click', () => moveController.disable());
