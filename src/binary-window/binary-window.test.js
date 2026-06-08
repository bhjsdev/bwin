import { describe, it, expect } from 'vitest';
import { BinaryWindow } from './binary-window';
import { DEFAULT_GLASS_ACTIONS } from './glass';
import { DEFAULT_DETACHED_GLASS_ACTIONS } from './detached-glass';

describe('BinaryWindow.normActions', () => {
  it('returns the builtin actions when actions is undefined', () => {
    expect(BinaryWindow.normActions(undefined)).toEqual([DEFAULT_GLASS_ACTIONS, DEFAULT_DETACHED_GLASS_ACTIONS]);
  });

  it('returns [[], []] when actions is null, empty, or not an array', () => {
    expect(BinaryWindow.normActions(null)).toEqual([[], []]);
    expect(BinaryWindow.normActions('a')).toEqual([[], []]);
    expect(BinaryWindow.normActions({})).toEqual([[], []]);
    expect(BinaryWindow.normActions([])).toEqual([[], []]);
  });

  it('returns [glassActions, []] for a single grouped array', () => {
    const a = { label: 'A' };

    expect(BinaryWindow.normActions([[a]])).toEqual([[a], []]);
  });

  it('returns [actions, []] when actions is a flat array', () => {
    const a = { label: 'A' };
    const b = { label: 'B' };

    expect(BinaryWindow.normActions([a, b])).toEqual([[a, b], []]);
  });

  it('returns [[], detachedGlassActions] when first group is absent', () => {
    const b = { label: 'B' };

    expect(BinaryWindow.normActions([undefined, [b]])).toEqual([[], [b]]);
    expect(BinaryWindow.normActions([null, [b]])).toEqual([[], [b]]);
  });

  it('returns [glassActions, []] when second group is absent', () => {
    const a = { label: 'A' };

    expect(BinaryWindow.normActions([[a], undefined])).toEqual([[a], []]);
    expect(BinaryWindow.normActions([[a], null])).toEqual([[a], []]);
  });

  it('returns actions as-is when both groups are arrays', () => {
    const a = { label: 'A' };
    const b = { label: 'B' };
    const grouped = [[a], [b]];

    expect(BinaryWindow.normActions(grouped)).toBe(grouped);
  });

  it('throws when an array is present but neither of the first two slots is one', () => {
    expect(() => BinaryWindow.normActions([null, null, []])).toThrow('[bwin] Invalid actions format');
  });
});
