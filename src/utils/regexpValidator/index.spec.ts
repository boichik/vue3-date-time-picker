import { describe, it, expect } from 'vitest';
import { regexpValidator } from './index';

describe('regexpValidator', () => {
  it.each([
    ['hello', /hello/],
    ['123', /^\d+$/],
    ['test@example.com', /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/],
  ])(
    'should return true for valid string matching regex: %s',
    (value, regexp) => {
      expect(regexpValidator(value, regexp)).toBe(true);
    }
  );

  it.each([
    ['hello', /world/],
    ['abc', /^\d+$/],
    ['invalid-email', /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/],
  ])(
    'should return false for string not matching regex: %s',
    (value, regexp) => {
      expect(regexpValidator(value, regexp)).toBe(false);
    }
  );

  it.each([[null], [undefined], [''], [0], [123], [true], [false], [{}], [[]]])(
    'should return false for invalid value types or empty string: %s',
    value => {
      expect(regexpValidator(value, /.*/)).toBe(false);
    }
  );
});
