import { regexpValidator } from '@/utils/regexpValidator';

const regexpValidatorCases: [unknown, RegExp, boolean][] = [
  ['123', /^\d+$/, true],
  ['abc123', /^[a-z]+\d+$/, true],
  ['hello', /^hello$/, true],
  ['2025-01-12', /^\d{4}-\d{2}-\d{2}$/, true],
  ['123abc', /^\d+$/, false],
  ['hello world', /^hello$/, false],
  ['01/12/2025', /^\d{4}-\d{2}-\d{2}$/, false],
  [123, /^\d+$/, false],
  [null, /^\d+$/, false],
  [undefined, /^\d+$/, false],
  [{}, /^\d+$/, false],
  [[], /^\d+$/, false],
  ['', /^\d+$/, false],
  [null, /^\d+$/, false],
  [undefined, /^\d+$/, false],
  ['example@domain.com', /^[^\s@]+@[^\s@]+\.[^\s@]+$/, true],
  ['not-an-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/, false],
  ['123-456-7890', /^\d{3}-\d{3}-\d{4}$/, true],
  ['1234567890', /^\d{3}-\d{3}-\d{4}$/, false],
];

describe('Utils: regexpValidator', () => {
  it.each(regexpValidatorCases)(
    'returns "%s" for value "%s" with regexp "%s"',
    (value, regexp, expected) => {
      expect(regexpValidator(value, regexp)).toBe(expected);
    }
  );
});
