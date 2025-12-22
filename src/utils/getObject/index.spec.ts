import { describe, it, expect } from 'vitest';
import { getObject } from './index';

describe('getObject', () => {
  it('should return the object itself if the input is a valid object', () => {
    const input = { key: 'value' };
    const result = getObject(input);
    expect(result).toBe(input);
  });

  it('should return the array itself if the input is an array', () => {
    const input = [1, 2, 3];
    const result = getObject(input);
    expect(result).toBe(input);
  });

  it.each([
    [null, {}],
    [undefined, {}],
    ['string', {}],
    [123, {}],
    [true, {}],
    [Symbol('sym'), {}],
    [() => {}, {}],
  ])(
    'should return an empty object for non-object input: %s',
    (input, expected) => {
      const result = getObject(input);
      expect(result).toEqual(expected);
    }
  );

  it('should return a typed object correctly', () => {
    interface TestType {
      a: number;
    }
    const input = { a: 1 };
    const result = getObject<TestType>(input);
    expect(result).toEqual(input);
  });
});
