import { describe, it, expect } from 'vitest';
import { parseSize, strictAssign, createDomNode } from './utils';

describe('parseSize', () => {
  it('returns the number when a valid number is passed', () => {
    expect(parseSize(100)).toBe(100);
    expect(parseSize(0)).toBe(0);
    expect(parseSize(-50)).toBe(-50);
    expect(parseSize(50.5)).toBe(50.5);
  });

  it('returns the correct value for percentage strings', () => {
    expect(parseSize('50%')).toBe(0.5);
    expect(parseSize('100%')).toBe(1);
    expect(parseSize('0%')).toBe(0);
    expect(parseSize('75.5%')).toBe(0.755);
  });

  it('returns the correct value for pixel strings', () => {
    expect(parseSize('100px')).toBe(100);
    expect(parseSize('0px')).toBe(0);
    expect(parseSize('-50px')).toBe(-50);
    expect(parseSize('50.5px')).toBe(50.5);
  });

  it('returns NaN for invalid strings', () => {
    expect(parseSize('abc')).toBeNaN();
    expect(parseSize('50abc')).toBeNaN();
    expect(parseSize('px')).toBeNaN();
  });

  it('returns NaN for invalid types', () => {
    expect(parseSize(null)).toBeNaN();
    expect(parseSize(undefined)).toBeNaN();
    expect(parseSize({})).toBeNaN();
    expect(parseSize([])).toBeNaN();
  });
});

describe('strictAssign', () => {
  it('merges source object into target object', () => {
    const target = { a: 1 };
    const source = { b: 2 };
    strictAssign(target, source);
    expect(target).toEqual({ a: 1, b: 2 });
  });

  it('throws error if key already exists in target object', () => {
    expect(() => {
      strictAssign({ a: 1 }, { a: 2 });
    }).toThrow();
  });

  it('throws error when source has the same key of target created by class', () => {
    class Target {
      a = 1;
    }
    const source = { a: 2 };
    const target = new Target();
    expect(() => strictAssign(target, source)).toThrow();
  });

  it('works for objects with prototype', () => {
    class Target {
      a = 1;
    }
    const source = { b: 2 };

    strictAssign(Target.prototype, source);
    const target = new Target();
    expect(target.a).toBe(1);
    expect(target.b).toBe(2);
  });

  it('works when source is added to the prototype of a class', () => {
    class Target {
      a = 1;
    }
    const source = { a: 2 };

    strictAssign(Target.prototype, source);
    const target = new Target();
    expect(target.a).toBe(1);
    expect(Object.getPrototypeOf(target).a).toBe(2);
  });

  it('throws error when source with same key added at 2nd time', () => {
    class Target {
      a = 1;
    }
    const source = { a: 2 };

    strictAssign(Target.prototype, source);
    expect(() => strictAssign(Target.prototype, source)).toThrow();

    const source2 = { a: 3 };
    expect(() => strictAssign(Target.prototype, source2)).toThrow();
  });
});

describe('createDomNode', () => {
  it('creates a text node from NaN', () => {
    const node = createDomNode(NaN);
    expect(node.nodeType).toBe(Node.TEXT_NODE);
    expect(node.nodeValue).toBe('NaN');
  });
});
