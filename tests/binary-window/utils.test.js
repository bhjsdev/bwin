import { describe, it, expect } from 'vitest';
import { normActions } from '@/binary-window/utils';
import { DEFAULT_GLASS_ACTIONS } from '@/binary-window/glass';
import { DEFAULT_DETACHED_GLASS_ACTIONS } from '@/binary-window/detached-glass';

describe('normActions', () => {
  it('returns the builtin actions when actions is undefined', () => {
    expect(normActions(undefined)).toEqual([DEFAULT_GLASS_ACTIONS, DEFAULT_DETACHED_GLASS_ACTIONS]);
  });

  it('returns [[], []] when actions is null, empty, or not an array', () => {
    expect(normActions(null)).toEqual([[], []]);
    expect(normActions('a')).toEqual([[], []]);
    expect(normActions({})).toEqual([[], []]);
    expect(normActions([])).toEqual([[], []]);
  });

  it('returns [glassActions, DEFAULT_DETACHED_GLASS_ACTIONS] for a single grouped array', () => {
    const a = { label: 'A' };

    expect(normActions([[a]])).toEqual([[a], DEFAULT_DETACHED_GLASS_ACTIONS]);
  });

  it('returns [actions, DEFAULT_DETACHED_GLASS_ACTIONS] when actions is a flat array', () => {
    const a = { label: 'A' };
    const b = { label: 'B' };

    expect(normActions([a, b])).toEqual([[a, b], DEFAULT_DETACHED_GLASS_ACTIONS]);
  });

  it('returns [[], detachedGlassActions] when first group is absent', () => {
    const b = { label: 'B' };

    expect(normActions([undefined, [b]])).toEqual([[], [b]]);
    expect(normActions([null, [b]])).toEqual([[], [b]]);
  });

  it('returns [glassActions, []] when second group is absent', () => {
    const a = { label: 'A' };

    expect(normActions([[a], undefined])).toEqual([[a], []]);
    expect(normActions([[a], null])).toEqual([[a], []]);
  });

  it('returns actions as-is when both groups are arrays', () => {
    const a = { label: 'A' };
    const b = { label: 'B' };
    const grouped = [[a], [b]];

    expect(normActions(grouped)).toBe(grouped);
  });

  it('throws when an array is present but neither of the first two slots is one', () => {
    expect(() => normActions([null, null, []])).toThrow('[bwin] Invalid actions format');
  });
});
