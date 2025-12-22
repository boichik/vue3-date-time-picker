import { describe, it, expect } from 'vitest';
import { isValidTimeZone } from './index';

describe('isValidTimeZone', () => {
  it.each(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'GMT'])(
    'should return true for valid timezone: %s',
    tz => {
      expect(isValidTimeZone(tz)).toBe(true);
    }
  );

  it.each([
    'Invalid/TimeZone',
    'Mars/Phobos',
    '',
    ' ',
    null,
    undefined,
    123,
    true,
    {},
    [],
  ])('should return false for invalid timezone: %s', tz => {
    expect(isValidTimeZone(tz)).toBe(false);
  });
});
