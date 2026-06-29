import { describe, it, expect, beforeEach } from 'vitest';
import { detachedGlassManager } from '@/binary-window/detached-glass/manager';

// The manager is a shared singleton; reset its state so tests don't leak into each other.
beforeEach(() => {
  detachedGlassManager.detachedGlassElements = [];
  detachedGlassManager.topZIndex = 1;
});

// `DetachedGlass` requires a valid `position`; supply one so tests focus on the manager.
const addGlass = (options = {}) =>
  detachedGlassManager.addDetachedGlass({ position: 'center', ...options });

describe('addDetachedGlass', () => {
  it('builds a detached glass, registers it, and returns the element', () => {
    const glassEl = addGlass();

    expect(glassEl.tagName.toLowerCase()).toBe('bw-glass');
    expect(glassEl.hasAttribute('detached')).toBe(true);
    expect(detachedGlassManager.detachedGlassElements).toContain(glassEl);
  });

  it('brings the new glass to front: assigns [active] and a z-index', () => {
    const glassEl = addGlass();

    expect(glassEl.hasAttribute('active')).toBe(true);
    expect(Number(glassEl.style.zIndex)).toBeGreaterThan(0);
  });

  // The manager is a pure registry: it never animates. Open/close animation
  // (the `opening`/`closing` attributes) lives in the crud layer.
  it('does not touch the open animation ([opening])', () => {
    const glassEl = addGlass();
    expect(glassEl.hasAttribute('opening')).toBe(false);
  });

  it('honors an explicit id', () => {
    const glassEl = addGlass({ id: 'my-glass' });
    expect(glassEl.id).toBe('my-glass');
  });

  it('throws when an id already exists in the stack', () => {
    addGlass({ id: 'dup' });

    expect(() => addGlass({ id: 'dup' })).toThrow(
      '[bwin] A detached glass with id "dup" already exists'
    );
    // The rejected glass must not have been registered.
    expect(detachedGlassManager.detachedGlassElements).toHaveLength(1);
  });
});

describe('getDetachedGlassById', () => {
  it('returns the matching glass element', () => {
    const glassEl = addGlass({ id: 'find-me' });
    expect(detachedGlassManager.getDetachedGlassById('find-me')).toBe(glassEl);
  });

  it('returns null when no glass has that id', () => {
    expect(detachedGlassManager.getDetachedGlassById('nope')).toBeNull();
  });
});

describe('getActiveDetachedGlass', () => {
  it('returns the front-most glass (the one holding [active])', () => {
    addGlass({ id: 'a' });
    const secondEl = addGlass({ id: 'b' });

    expect(detachedGlassManager.getActiveDetachedGlass()).toBe(secondEl);
  });

  it('returns null when there are no detached glasses', () => {
    expect(detachedGlassManager.getActiveDetachedGlass()).toBeNull();
  });
});

describe('bringToFront', () => {
  it('moves [active] to the raised glass and clears it from the others', () => {
    const firstEl = addGlass({ id: 'a' });
    const secondEl = addGlass({ id: 'b' });

    detachedGlassManager.bringToFront(firstEl);

    expect(firstEl.hasAttribute('active')).toBe(true);
    expect(secondEl.hasAttribute('active')).toBe(false);
  });

  it('steps the z-index by 2, reserving the odd slot below for a modal backdrop', () => {
    const firstEl = addGlass({ id: 'a' });
    const secondEl = addGlass({ id: 'b' });

    expect(Number(secondEl.style.zIndex) - Number(firstEl.style.zIndex)).toBe(2);
  });

  it('is a no-op when the glass is already front-most (no z-index bump)', () => {
    const glassEl = addGlass();
    const zIndexBefore = glassEl.style.zIndex;

    const result = detachedGlassManager.bringToFront(glassEl);

    expect(result).toBeUndefined();
    expect(glassEl.style.zIndex).toBe(zIndexBefore);
  });
});

describe('removeDetachedGlass', () => {
  // The manager only unregisters and returns the element synchronously; the crud
  // layer owns DOM removal and the close animation.
  it('unregisters the glass and returns the removed element', () => {
    const glassEl = addGlass({ id: 'gone' });

    const removed = detachedGlassManager.removeDetachedGlass('gone');

    expect(removed).toBe(glassEl);
    expect(detachedGlassManager.detachedGlassElements).not.toContain(glassEl);
  });

  it('leaves the DOM node in place (caller owns removal)', () => {
    const glassEl = addGlass({ id: 'gone' });
    document.body.append(glassEl);

    detachedGlassManager.removeDetachedGlass('gone');

    expect(glassEl.isConnected).toBe(true);
    glassEl.remove();
  });

  it('returns null when no glass has that id', () => {
    expect(detachedGlassManager.removeDetachedGlass('missing')).toBeNull();
  });
});

describe('updateDetachedGlass', () => {
  it('throws (not implemented yet)', () => {
    expect(() => detachedGlassManager.updateDetachedGlass('any', {})).toThrow(
      '[bwin] updateDetachedGlass is not implemented yet'
    );
  });
});
