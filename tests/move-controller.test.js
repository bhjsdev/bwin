import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MoveController } from '@/move-controller';

// jsdom has no layout engine, so geometry is stubbed per element/viewport.
// `getBoundingClientRect`, `clientWidth/Height`, and pointer capture all return
// nothing useful by default; each helper forces the values the controller reads.

function setViewport(width, height) {
  Object.defineProperty(document.documentElement, 'clientWidth', {
    value: width,
    configurable: true,
  });
  Object.defineProperty(document.documentElement, 'clientHeight', {
    value: height,
    configurable: true,
  });
}

// Create an absolutely-positioned target with a fixed rect. `offsetParent` defaults
// to null (static body → containing block is the viewport at the scroll origin).
function makeEl(rect = { left: 100, top: 100, width: 200, height: 200 }) {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({
    ...rect,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
  });
  el.setPointerCapture = vi.fn();
  el.releasePointerCapture = vi.fn();
  el.hasPointerCapture = vi.fn(() => true);
  Object.defineProperty(el, 'offsetParent', { value: null, configurable: true });
  document.body.appendChild(el);
  return el;
}

// Build a cancelable pointer-ish event and dispatch it on document (where the
// controller delegates). `target` defaults to the body so "empty space" is the default.
function fire(
  type,
  { pageX = 0, pageY = 0, button = 0, pointerId = 1, target = document.body } = {}
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, { pageX, pageY, button, pointerId });
  Object.defineProperty(event, 'target', { value: target, configurable: true });
  document.dispatchEvent(event);
  return event;
}

let ctrl;

beforeEach(() => {
  document.body.innerHTML = '';
  setViewport(1000, 800);
  // Reset any scroll shadowing a prior test may have left on window.
  Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
});

describe('constructor', () => {
  it('constructs with no arguments without throwing', () => {
    expect(() => new MoveController()).not.toThrow();
  });

  it('stores the initial target and starts idle', () => {
    const el = makeEl();
    ctrl = new MoveController({ target: el });
    expect(ctrl.targetElement).toBe(el);
    expect(ctrl.isMoving).toBe(false);
  });

  it('binds handlers so `this` survives being used as a document listener', () => {
    const el = makeEl();
    ctrl = new MoveController({ target: el });
    ctrl.enable();
    // If handlers were unbound, `this` would be `document` and this would throw.
    expect(() => fire('pointerdown', { target: el })).not.toThrow();
    expect(ctrl.isMoving).toBe(true);
  });
});

describe('setTarget', () => {
  it('re-points which element moves', () => {
    const first = makeEl({ left: 100, top: 100, width: 200, height: 200 });
    const second = makeEl({ left: 300, top: 100, width: 200, height: 200 });
    ctrl = new MoveController({ target: first });
    ctrl.enable();

    ctrl.setTarget(second);
    fire('pointerdown', { pageX: 0, pageY: 0, target: second });
    fire('pointermove', { pageX: 60, pageY: 0, target: second });

    expect(second.style.left).toBe('360px'); // 300 + 60
    expect(first.style.left).toBe(''); // original untouched
  });

  it('accepts null', () => {
    ctrl = new MoveController({ target: makeEl() });
    expect(() => ctrl.setTarget(null)).not.toThrow();
    expect(ctrl.targetElement).toBeNull();
  });
});

// With no consumer-set target, a bare press drags whatever was pressed, and each
// release re-resolves — so the same instance can drag any element without wiring.
describe('bare-press fallback', () => {
  it('drags the pressed element, then re-resolves after release', () => {
    const first = makeEl({ left: 100, top: 100, width: 200, height: 200 });
    const second = makeEl({ left: 400, top: 100, width: 200, height: 200 });
    ctrl = new MoveController(); // no target, no wiring
    ctrl.enable();

    fire('pointerdown', { pageX: 0, pageY: 0, target: first });
    fire('pointermove', { pageX: 20, pageY: 0, target: first });
    fire('pointerup', { target: first });
    expect(first.style.left).toBe('120px'); // 100 + 20

    // Next press resolves fresh to the newly-pressed element.
    fire('pointerdown', { pageX: 0, pageY: 0, target: second });
    fire('pointermove', { pageX: 30, pageY: 0, target: second });
    expect(second.style.left).toBe('430px'); // 400 + 30
    expect(first.style.left).toBe('120px'); // first left where it was
  });
});

describe('handlePointerDown', () => {
  let el;
  beforeEach(() => {
    el = makeEl();
    ctrl = new MoveController({ target: el });
    ctrl.enable();
  });

  it('starts a drag on the primary button', () => {
    fire('pointerdown', { target: el });
    expect(ctrl.isMoving).toBe(true);
  });

  it('ignores non-primary buttons', () => {
    fire('pointerdown', { button: 1, target: el }); // middle
    expect(ctrl.isMoving).toBe(false);
    fire('pointerdown', { button: 2, target: el }); // right
    expect(ctrl.isMoving).toBe(false);
  });

  it('falls back to the pressed element when no target is set', () => {
    ctrl.setTarget(null);
    fire('pointerdown', { target: el });
    expect(ctrl.isMoving).toBe(true);
    expect(ctrl.targetElement).toBe(el);
  });

  it('prevents the default action so text/selection is not dragged', () => {
    const event = fire('pointerdown', { target: el });
    expect(event.defaultPrevented).toBe(true);
  });

  it('captures the pointer on the pressed element', () => {
    fire('pointerdown', { pointerId: 7, target: el });
    expect(el.setPointerCapture).toHaveBeenCalledWith(7);
  });

  it('tolerates an element without setPointerCapture', () => {
    el.setPointerCapture = undefined;
    expect(() => fire('pointerdown', { target: el })).not.toThrow();
    expect(ctrl.isMoving).toBe(true);
  });
});

describe('handlePointerMove', () => {
  let el;
  beforeEach(() => {
    el = makeEl({ left: 100, top: 100, width: 200, height: 200 });
    ctrl = new MoveController({ target: el });
    ctrl.enable();
  });

  it('moves the target by the pointer delta', () => {
    fire('pointerdown', { pageX: 150, pageY: 150, target: el });
    fire('pointermove', { pageX: 200, pageY: 180, target: el });
    expect(el.style.left).toBe('150px'); // 100 + 50
    expect(el.style.top).toBe('130px'); // 100 + 30
  });

  it('neutralizes right/bottom anchoring while dragging', () => {
    fire('pointerdown', { pageX: 0, pageY: 0, target: el });
    fire('pointermove', { pageX: 10, pageY: 10, target: el });
    expect(el.style.right).toBe('auto');
    expect(el.style.bottom).toBe('auto');
  });

  it('confines to the far (right/bottom) viewport edge', () => {
    fire('pointerdown', { pageX: 0, pageY: 0, target: el });
    fire('pointermove', { pageX: 5000, pageY: 5000, target: el });
    expect(el.style.left).toBe('800px'); // 1000 - 200
    expect(el.style.top).toBe('600px'); // 800 - 200
  });

  it('confines to the near (left/top) viewport edge', () => {
    fire('pointerdown', { pageX: 0, pageY: 0, target: el });
    fire('pointermove', { pageX: -5000, pageY: -5000, target: el });
    expect(el.style.left).toBe('0px');
    expect(el.style.top).toBe('0px');
  });

  it('bails when a move arrives with no prior press', () => {
    expect(() => fire('pointermove', { pageX: 400, pageY: 400, target: el })).not.toThrow();
    expect(el.style.left).toBe('');
  });

  it('bails without throwing when the target is cleared mid-drag', () => {
    fire('pointerdown', { pageX: 150, pageY: 150, target: el });
    ctrl.setTarget(null); // yank the target between down and move
    expect(() => fire('pointermove', { pageX: 300, pageY: 300, target: el })).not.toThrow();
  });
});

// An already off-screen target (bounds breached at grab time) may travel inward
// toward the viewport but never further out — and each inward step ratchets the
// limit tighter until it is back inside, where the normal edge applies again.
describe('handlePointerMove — off-screen inward-only clamp', () => {
  let el;
  beforeEach(() => {
    // left:2000 is well past maxLeft (800). top:50 stays in-bounds so only X is tested.
    el = makeEl({ left: 2000, top: 50, width: 200, height: 200 });
    ctrl = new MoveController({ target: el });
    ctrl.enable();
    fire('pointerdown', { pageX: 0, pageY: 0, target: el }); // startLeft = 2000
  });

  it('allows inward motion while still off-screen', () => {
    fire('pointermove', { pageX: -500, pageY: 0, target: el }); // targetLeft 1500
    expect(el.style.left).toBe('1500px');
  });

  it('refuses to move further out than the current position', () => {
    fire('pointermove', { pageX: -500, pageY: 0, target: el }); // ratchet to 1500
    fire('pointermove', { pageX: -200, pageY: 0, target: el }); // targetLeft 1800 → clamped back to 1500
    expect(el.style.left).toBe('1500px');
  });

  it('snaps to the normal edge once dragged back inside', () => {
    fire('pointermove', { pageX: -1500, pageY: 0, target: el }); // targetLeft 500 → on-screen
    expect(el.style.left).toBe('500px');
    fire('pointermove', { pageX: -100, pageY: 0, target: el }); // targetLeft 1900 → normal max 800
    expect(el.style.left).toBe('800px');
  });
});

describe('handlePointerUp', () => {
  let el;
  beforeEach(() => {
    el = makeEl();
    ctrl = new MoveController({ target: el });
    ctrl.enable();
  });

  it('ends the drag and clears capture bookkeeping', () => {
    fire('pointerdown', { target: el });
    fire('pointerup', { target: el });
    expect(ctrl.isMoving).toBe(false);
    expect(ctrl.captureElement).toBeNull();
    expect(ctrl.capturePointerId).toBeNull();
  });

  it('clears the target so the next press re-resolves it', () => {
    fire('pointerdown', { target: el });
    fire('pointerup', { target: el });
    expect(ctrl.targetElement).toBeNull();
  });

  it('releases the pointer capture it took', () => {
    fire('pointerdown', { pointerId: 3, target: el });
    fire('pointerup', { pointerId: 3, target: el });
    expect(el.releasePointerCapture).toHaveBeenCalledWith(3);
  });

  it('does not release capture it no longer holds', () => {
    el.hasPointerCapture = vi.fn(() => false);
    fire('pointerdown', { target: el });
    fire('pointerup', { target: el });
    expect(el.releasePointerCapture).not.toHaveBeenCalled();
  });

  it('bails when an up arrives with no prior press', () => {
    expect(() => fire('pointerup', { target: el })).not.toThrow();
    expect(ctrl.isMoving).toBe(false);
  });

  it('stops movement after the drag ends', () => {
    fire('pointerdown', { pageX: 0, pageY: 0, target: el });
    fire('pointermove', { pageX: 30, pageY: 0, target: el }); // 130px
    fire('pointerup', { target: el });
    fire('pointermove', { pageX: 90, pageY: 0, target: el }); // ignored — drag over
    expect(el.style.left).toBe('130px');
  });
});

describe('containing block origin', () => {
  it('offsets bounds by the document scroll for a static-body target', () => {
    Object.defineProperty(window, 'scrollX', { value: 50, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 20, configurable: true });
    // Rect is viewport-relative (left:100), origin is {-50,-20}, so start = 150/120.
    const el = makeEl({ left: 100, top: 100, width: 200, height: 200 });
    ctrl = new MoveController({ target: el });
    ctrl.enable();

    fire('pointerdown', { pageX: 0, pageY: 0, target: el });
    fire('pointermove', { pageX: 10, pageY: 10, target: el });
    expect(el.style.left).toBe('160px'); // 150 + 10
    expect(el.style.top).toBe('130px'); // 120 + 10
  });

  it('uses a non-static offsetParent rect as the origin', () => {
    const parent = document.createElement('div');
    parent.style.position = 'absolute';
    parent.getBoundingClientRect = () => ({
      left: 40,
      top: 30,
      width: 500,
      height: 500,
      right: 540,
      bottom: 530,
    });
    document.body.appendChild(parent);

    const el = makeEl({ left: 100, top: 100, width: 100, height: 100 });
    Object.defineProperty(el, 'offsetParent', { value: parent, configurable: true });
    ctrl = new MoveController({ target: el });
    ctrl.enable();

    fire('pointerdown', { pageX: 0, pageY: 0, target: el });
    fire('pointermove', { pageX: 5, pageY: 5, target: el });
    expect(el.style.left).toBe('65px'); // (100 - 40) + 5
    expect(el.style.top).toBe('75px'); // (100 - 30) + 5
  });
});

describe('lifecycle hooks', () => {
  it('are optional — a drag works with none provided', () => {
    const el = makeEl();
    ctrl = new MoveController({ target: el }); // no hooks
    ctrl.enable();
    expect(() => {
      fire('pointerdown', { target: el });
      fire('pointermove', { pageX: 10, target: el });
      fire('pointerup', { target: el });
    }).not.toThrow();
  });

  it('fire once per phase with the event', () => {
    const onPointerDown = vi.fn();
    const onPointerMove = vi.fn();
    const onPointerUp = vi.fn();
    const el = makeEl();
    ctrl = new MoveController({ target: el, onPointerDown, onPointerMove, onPointerUp });
    ctrl.enable();

    const down = fire('pointerdown', { target: el });
    const move = fire('pointermove', { pageX: 10, target: el });
    const up = fire('pointerup', { target: el });

    expect(onPointerDown).toHaveBeenCalledOnce();
    expect(onPointerDown).toHaveBeenCalledWith(down);
    expect(onPointerMove).toHaveBeenCalledWith(move);
    expect(onPointerUp).toHaveBeenCalledWith(up);
  });

  it('runs onPointerDown only after drag state is established', () => {
    const el = makeEl();
    let movingWhenCalled = null;
    ctrl = new MoveController({
      target: el,
      onPointerDown: () => (movingWhenCalled = ctrl.isMoving),
    });
    ctrl.enable();
    fire('pointerdown', { target: el });
    expect(movingWhenCalled).toBe(true);
  });

  it('does not fire hooks for an ignored non-primary press', () => {
    const onPointerDown = vi.fn();
    const el = makeEl();
    ctrl = new MoveController({ target: el, onPointerDown });
    ctrl.enable();

    fire('pointerdown', { button: 2, target: el }); // non-primary
    expect(onPointerDown).not.toHaveBeenCalled();
  });
});

describe('enable / disable', () => {
  let el;
  beforeEach(() => {
    el = makeEl();
  });

  it('disable() stops the controller from reacting to presses', () => {
    ctrl = new MoveController({ target: el });
    ctrl.enable();
    ctrl.disable();
    fire('pointerdown', { target: el });
    expect(ctrl.isMoving).toBe(false);
  });

  it('freezes an in-flight drag when disabled mid-drag', () => {
    ctrl = new MoveController({ target: el });
    ctrl.enable();
    fire('pointerdown', { pageX: 0, pageY: 0, target: el });
    fire('pointermove', { pageX: 30, pageY: 0, target: el }); // 130px
    ctrl.disable();
    fire('pointermove', { pageX: 300, pageY: 0, target: el }); // listener gone → no move
    expect(el.style.left).toBe('130px');
  });

  it('does not stack listeners when enabled twice', () => {
    const onPointerDown = vi.fn();
    ctrl = new MoveController({ target: el, onPointerDown });
    ctrl.enable();
    ctrl.enable(); // identical bound handler → deduped by addEventListener
    fire('pointerdown', { target: el });
    expect(onPointerDown).toHaveBeenCalledOnce();
  });

  it('can be re-enabled after disable', () => {
    ctrl = new MoveController({ target: el });
    ctrl.enable();
    ctrl.disable();
    ctrl.enable();
    fire('pointerdown', { target: el });
    expect(ctrl.isMoving).toBe(true);
  });
});
