import { describe, it, expect } from 'vitest';
import { isEmptyModels } from './index';

describe('isEmptyModels', () => {
  it.each([
    [null, null],
    [undefined, undefined],
    [null, undefined],
    ['', null],
    [0, null],
    [false, false],
  ])('should return true when both models are falsy: %s, %s', (start, end) => {
    expect(isEmptyModels(start, end)).toBe(true);
  });

  it.each([
    [[], []],
    [[null], [undefined]],
    [[null, undefined], [null]],
    [[false], [0]],
    [[], [null]],
  ])(
    'should return true when both models are arrays with no truthy values: %s, %s',
    (start, end) => {
      expect(isEmptyModels(start, end)).toBe(true);
    }
  );

  it.each([
    ['value', null],
    [null, 'value'],
    [123, undefined],
    [true, null],
    [new Date(), null],
  ])(
    'should return false when at least one model is truthy (non-array): %s, %s',
    (start, end) => {
      expect(isEmptyModels(start, end)).toBe(false);
    }
  );

  it.each([
    [['value'], []],
    [[], ['value']],
    [[1], [null]],
    [[null], [true]],
    [[new Date()], []],
  ])(
    'should return false when at least one array model contains a truthy value: %s, %s',
    (start, end) => {
      expect(isEmptyModels(start, end)).toBe(false);
    }
  );

  it.each([
    [[], null],
    [null, []],
    [[null], undefined],
  ])(
    'should return false when mixed types (array and non-array) are provided, even if "empty-like"',
    (start, end) => {
      // The implementation only checks for both arrays empty OR both falsy.
      // If one is array (truthy object) and other is null, first check fails.
      // Second check requires BOTH to be arrays.
      // So isEmptyModels([], null) -> false because [] is truthy, and they are not both arrays.
      expect(isEmptyModels(start, end)).toBe(false);
    }
  );
});
