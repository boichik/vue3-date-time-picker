import { isValidLocale } from '@/utils/isValidLocale';

describe('Utils: isValidLocale', () => {
  const testCase: any[] = [
    [false, false],
    [true, false],
    [[], false],
    [{}, false],
    [undefined, false],
    [null, false],
    [0, false],
    [NaN, false],
    ['', false],
    ['unknow', false],
    ['incorrect', false],
    ['en', true],
    ['en-US', true],
    ['uk', true],
    ['de', true],
  ];

  it.each(testCase)(
    'isValidLocale: value= %p; resule = %p',
    (value, result) => {
      expect(isValidLocale(value)).toBe(result);
    }
  );
});
