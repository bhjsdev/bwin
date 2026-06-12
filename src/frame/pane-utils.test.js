import { describe, it, expect } from 'vitest';
import { addPaneSash } from './pane-utils';
import { Sash, DEFAULTS } from '../sash';
import { Position } from '../position';

function makeTargetSash() {
  return new Sash({
    top: 0,
    left: 0,
    width: 800,
    height: 600,
    position: Position.Root,
  });
}

describe('addPaneSash min-size threading', () => {
  for (const position of [Position.Left, Position.Right, Position.Top, Position.Bottom]) {
    it(`carries minWidth/minHeight onto the new ${position} pane sash`, () => {
      const target = makeTargetSash();

      const newSash = addPaneSash(target, {
        position,
        id: 'new-pane',
        minWidth: 222,
        minHeight: 333,
      });

      expect(newSash.minWidth).toBe(222);
      expect(newSash.minHeight).toBe(333);
    });
  }

  it('falls back to Sash defaults when min-size props are omitted', () => {
    const target = makeTargetSash();

    const newSash = addPaneSash(target, { position: Position.Left, id: 'new-pane' });

    expect(newSash.minWidth).toBe(DEFAULTS.minWidth);
    expect(newSash.minHeight).toBe(DEFAULTS.minHeight);
  });

  it('leaves the retained sibling sash at its own defaults', () => {
    const target = makeTargetSash();

    addPaneSash(target, {
      position: Position.Left,
      id: 'new-pane',
      minWidth: 222,
      minHeight: 333,
    });

    // The new pane is the Left child; the original content moves to the sibling
    const sibling = target.children.find((child) => child.id !== 'new-pane');
    expect(sibling.minWidth).toBe(DEFAULTS.minWidth);
    expect(sibling.minHeight).toBe(DEFAULTS.minHeight);
  });
});
