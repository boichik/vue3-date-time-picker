import { describe, it, expect } from 'vitest';
import { isValidLocale } from './index';

describe('isValidLocale', () => {
  it.each(['en-US', 'uk-UA', 'de', 'fr-CA', 'zh-CN', 'ja-JP'])(
    'should return true for valid locale: %s',
    locale => {
      expect(isValidLocale(locale)).toBe(true);
    }
  );

  it.each([
    'invalid_locale',
    'very-very-very-long-invalid-tag-that-should-fail',
    '123',
    '',
    null,
    undefined,
    123,
    true,
    {},
    [],
  ])('should return false for invalid locale: %s', locale => {
    expect(isValidLocale(locale)).toBe(false);
  });
});
