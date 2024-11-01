import { describe, it, expect } from 'vitest';
import { parseSize } from './utils';

describe('parseSize', () => {
  it('should return the number when a valid number is passed', () => {
    expect(parseSize(100)).toBe(100);
    expect(parseSize(0)).toBe(0);
    expect(parseSize(-50)).toBe(-50);
    expect(parseSize(50.5)).toBe(50.5);
  });

  it('should return the correct value for percentage strings', () => {
    expect(parseSize('50%')).toBe(0.5);
    expect(parseSize('100%')).toBe(1);
    expect(parseSize('0%')).toBe(0);
    expect(parseSize('75.5%')).toBe(0.755);
  });

  it('should return the correct value for pixel strings', () => {
    expect(parseSize('100px')).toBe(100);
    expect(parseSize('0px')).toBe(0);
    expect(parseSize('-50px')).toBe(-50);
    expect(parseSize('50.5px')).toBe(50.5);
  });

  it('should return NaN for invalid strings', () => {
    expect(parseSize('abc')).toBeNaN();
    expect(parseSize('50abc')).toBeNaN();
    expect(parseSize('px')).toBeNaN();
  });

  it('should return NaN for invalid types', () => {
    expect(parseSize(null)).toBeNaN();
    expect(parseSize(undefined)).toBeNaN();
    expect(parseSize({})).toBeNaN();
    expect(parseSize([])).toBeNaN();
  });
});
