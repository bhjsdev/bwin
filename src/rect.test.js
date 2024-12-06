import { describe, it, expect } from 'vitest';
import { getIntersectRect } from './rect';

describe('getIntersectRect', () => {
  it('returns the intersected rect object 1', () => {
    const rect1 = { left: 0, top: 0, width: 100, height: 100 };
    const rect2 = { left: 50, top: 50, width: 200, height: 200 };

    expect(getIntersectRect(rect1, rect2)).toEqual({
      left: 50,
      top: 50,
      width: 50,
      height: 50,
    });
    expect(getIntersectRect(rect2, rect1)).toEqual({
      left: 50,
      top: 50,
      width: 50,
      height: 50,
    });
  });

  it('returns the intersected rect object 2', () => {
    const rect1 = { left: 150, top: 150, width: 100, height: 100 };
    const rect2 = { left: 100, top: 100, width: 111, height: 111 };

    expect(getIntersectRect(rect1, rect2)).toEqual({
      left: 150,
      top: 150,
      width: 61,
      height: 61,
    });
    expect(getIntersectRect(rect2, rect1)).toEqual({
      left: 150,
      top: 150,
      width: 61,
      height: 61,
    });
  });

  it('returns the null, when not intersected', () => {
    const rect1 = { left: 0, top: 0, width: 100, height: 100 };
    const rect2 = { left: 100, top: 100, width: 100, height: 100 };

    expect(getIntersectRect(rect1, rect2)).toEqual(null);
    expect(getIntersectRect(rect2, rect1)).toEqual(null);
  });
});
