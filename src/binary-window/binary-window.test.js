import { describe, it, expect } from 'vitest';
import { BinaryWindow } from './binary-window';

describe('BinaryWindow.normActions', () => {
  it('returns [[], []] when actions is not an array', () => {
    expect(BinaryWindow.normActions(undefined)).toEqual([[], []]);
    expect(BinaryWindow.normActions(null)).toEqual([[], []]);
    expect(BinaryWindow.normActions('a')).toEqual([[], []]);
    expect(BinaryWindow.normActions({})).toEqual([[], []]);
  });

  it('returns [actions, []] when actions is a flat array', () => {
    const a = { label: 'A' };
    const b = { label: 'B' };

    expect(BinaryWindow.normActions([])).toEqual([[], []]);
    expect(BinaryWindow.normActions([a, b])).toEqual([[a, b], []]);
  });

  it('returns actions as-is when it already contains arrays', () => {
    const a = { label: 'A' };
    const b = { label: 'B' };
    const grouped = [[a], [b]];

    expect(BinaryWindow.normActions(grouped)).toBe(grouped);
  });
});
