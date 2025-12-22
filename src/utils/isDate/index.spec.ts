import { describe, it, expect } from 'vitest';
import { isDate } from './index';

describe('isDate', () => {
  it.each([
    [new Date(), true],
    [new Date('2023-01-01'), true],
    [new Date(2023, 0, 1), true],
  ])('should return true for valid Date object: %s', (value, expected) => {
    expect(isDate(value)).toBe(expected);
  });

  it.each([
    [new Date('invalid-date'), false],
    [null, false],
    [undefined, false],
    ['2023-01-01', false],
    [1672531200000, false],
    [{}, false],
    [[], false],
    [true, false],
    [() => {}, false],
  ])(
    'should return false for invalid Date or non-Date values: %s',
    (value, expected) => {
      expect(isDate(value)).toBe(expected);
    }
  );
});
