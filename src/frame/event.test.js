import { describe, it, expect } from 'vitest';
import eventModule from './event';

// Each test gets a fresh emitter, mirroring how `eventModule` is assembled onto
// a `Frame`/`BinaryWindow` instance (its methods run with `this` as that instance).
function makeEmitter() {
  return Object.create(eventModule);
}

describe('on / emit', () => {
  it('calls a registered listener with the emitted detail', () => {
    const e = makeEmitter();
    const detail = { sash: 'a' };
    let received;
    e.on('pane-add', (d) => (received = d));

    e.emit('pane-add', detail);

    expect(received).toBe(detail); // same reference, not a copy
  });

  it('passes `undefined` detail through when none is given', () => {
    const e = makeEmitter();
    let called = false;
    let received = 'sentinel';
    e.on('pane-add', (d) => {
      called = true;
      received = d;
    });

    e.emit('pane-add');

    expect(called).toBe(true);
    expect(received).toBeUndefined();
  });

  it('calls all listeners for an event, in registration order', () => {
    const e = makeEmitter();
    const calls = [];
    e.on('pane-add', () => calls.push('first'));
    e.on('pane-add', () => calls.push('second'));
    e.on('pane-add', () => calls.push('third'));

    e.emit('pane-add');

    expect(calls).toEqual(['first', 'second', 'third']);
  });

  it('only calls listeners for the emitted event name', () => {
    const e = makeEmitter();
    let addCalls = 0;
    let removeCalls = 0;
    e.on('pane-add', () => addCalls++);
    e.on('pane-remove', () => removeCalls++);

    e.emit('pane-add');

    expect(addCalls).toBe(1);
    expect(removeCalls).toBe(0);
  });

  it('registers the same listener only once (Set dedupe)', () => {
    const e = makeEmitter();
    let count = 0;
    const listener = () => count++;
    e.on('pane-add', listener);
    e.on('pane-add', listener);

    e.emit('pane-add');

    expect(count).toBe(1);
  });

  it('returns true and does not throw when an event has no listeners', () => {
    const e = makeEmitter();
    expect(e.emit('pane-add')).toBe(true);
  });

  it('does not throw when emitting before any listener was ever registered', () => {
    const e = makeEmitter();
    // `eventListeners` map is not created until the first `on`/`emit`.
    expect(() => e.emit('never-registered')).not.toThrow();
  });
});

describe('emit veto semantics', () => {
  it('returns true when no listener returns false', () => {
    const e = makeEmitter();
    e.on('before-pane-remove', () => {});
    expect(e.emit('before-pane-remove')).toBe(true);
  });

  it('returns false when a listener returns false', () => {
    const e = makeEmitter();
    e.on('before-pane-remove', () => false);
    expect(e.emit('before-pane-remove')).toBe(false);
  });

  it('returns false if any one of several listeners returns false', () => {
    const e = makeEmitter();
    e.on('before-pane-remove', () => true);
    e.on('before-pane-remove', () => false);
    e.on('before-pane-remove', () => undefined);
    expect(e.emit('before-pane-remove')).toBe(false);
  });

  it('vetoes regardless of which listener returns false (order-independent)', () => {
    const veto = makeEmitter();
    veto.on('e', () => false);
    veto.on('e', () => true);

    const veto2 = makeEmitter();
    veto2.on('e', () => true);
    veto2.on('e', () => false);

    expect(veto.emit('e')).toBe(false);
    expect(veto2.emit('e')).toBe(false);
  });

  it('runs every listener even after one has vetoed (no short-circuit)', () => {
    const e = makeEmitter();
    const calls = [];
    e.on('before-pane-remove', () => {
      calls.push('first');
      return false;
    });
    e.on('before-pane-remove', () => calls.push('second'));

    e.emit('before-pane-remove');

    expect(calls).toEqual(['first', 'second']);
  });

  it('only an explicit `false` vetoes — other falsy returns proceed', () => {
    for (const value of [undefined, null, 0, '', NaN]) {
      const e = makeEmitter();
      e.on('before-pane-remove', () => value);
      expect(e.emit('before-pane-remove')).toBe(true);
    }
  });

  it('does not treat a truthy return as a veto', () => {
    const e = makeEmitter();
    e.on('before-pane-remove', () => 'yes');
    expect(e.emit('before-pane-remove')).toBe(true);
  });
});

describe('off', () => {
  it('removes a previously registered listener', () => {
    const e = makeEmitter();
    let count = 0;
    const listener = () => count++;
    e.on('pane-add', listener);

    e.off('pane-add', listener);
    e.emit('pane-add');

    expect(count).toBe(0);
  });

  it('leaves other listeners on the same event intact', () => {
    const e = makeEmitter();
    let kept = 0;
    const removed = () => {};
    const keptListener = () => kept++;
    e.on('pane-add', removed);
    e.on('pane-add', keptListener);

    e.off('pane-add', removed);
    e.emit('pane-add');

    expect(kept).toBe(1);
  });

  it('is a no-op for a listener that was never registered', () => {
    const e = makeEmitter();
    e.on('pane-add', () => {});
    expect(() => e.off('pane-add', () => {})).not.toThrow();
  });

  it('is a no-op for an unknown event name', () => {
    const e = makeEmitter();
    expect(() => e.off('unknown', () => {})).not.toThrow();
  });

  it('does not throw when called before any listener was registered', () => {
    const e = makeEmitter();
    expect(() => e.off('pane-add', () => {})).not.toThrow();
  });
});

describe('instance isolation', () => {
  it('does not share listeners between instances', () => {
    const a = makeEmitter();
    const b = makeEmitter();
    let aCalls = 0;
    a.on('pane-add', () => aCalls++);

    b.emit('pane-add'); // b has no listeners of its own

    expect(aCalls).toBe(0);
  });

  it("a veto on one instance does not affect another instance's emit", () => {
    const a = makeEmitter();
    const b = makeEmitter();
    a.on('before-pane-remove', () => false);

    expect(b.emit('before-pane-remove')).toBe(true);
  });
});
