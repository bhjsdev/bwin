import { describe, it, expect } from 'vitest';
import { DetachedGlass } from './detached-glass';

const build = (options = {}) => new DetachedGlass({ position: 'center', ...options }).domNode;

describe('DetachedGlass can-resize', () => {
  it('is "true" by default so resize handles appear on hover', () => {
    const glassEl = build();
    expect(glassEl.getAttribute('can-resize')).toBe('true');
  });

  it('is "false" when resizable is false', () => {
    const glassEl = build({ resizable: false });
    expect(glassEl.getAttribute('can-resize')).toBe('false');
  });
});
