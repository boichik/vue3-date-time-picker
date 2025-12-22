import { describe, it, expect } from 'vitest';
import { isValidModelValue } from './index';

describe('isValidModelValue', () => {
  it.each([
    [null],
    [new Date()],
    [[new Date(), new Date()]],
    [[null, new Date()]],
    [[]],
  ])('should return true for valid values (default options): %s', value => {
    expect(isValidModelValue(value)).toBe(true);
  });

  it.each([
    [undefined],
    ['2023-01-01'],
    [123],
    [new Date('invalid')],
    [[new Date('invalid')]],
    [[123]],
    [{}],
  ])('should return false for invalid values (default options): %s', value => {
    expect(isValidModelValue(value)).toBe(false);
  });

  it.each([[null], [new Date()]])(
    'should return true for valid single values when onlySingle is true: %s',
    value => {
      expect(isValidModelValue(value, { onlySingle: true })).toBe(true);
    }
  );

  it.each([[[new Date()]], [[]], [undefined], [new Date('invalid')]])(
    'should return false for range or invalid values when onlySingle is true: %s',
    value => {
      expect(isValidModelValue(value, { onlySingle: true })).toBe(false);
    }
  );

  it.each([[[new Date()]], [[null, new Date()]], [[]]])(
    'should return true for valid range values when onlyRange is true: %s',
    value => {
      expect(isValidModelValue(value, { onlyRange: true })).toBe(true);
    }
  );

  it.each([[null], [new Date()], [undefined], [[new Date('invalid')]]])(
    'should return false for single or invalid values when onlyRange is true: %s',
    value => {
      expect(isValidModelValue(value, { onlyRange: true })).toBe(false);
    }
  );
});
