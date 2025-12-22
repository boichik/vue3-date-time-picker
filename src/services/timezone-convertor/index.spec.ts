import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TimezoneConvertor } from './index';
import * as isValidTimeZoneModule from '@/utils/isValidTimeZone';
import * as isDateModule from '@/utils/isDate';

describe('TimezoneConvertor', () => {
  let convertor: TimezoneConvertor;
  const mockLocalDate = new Date('2025-01-01T12:00:00Z');

  beforeEach(() => {
    convertor = new TimezoneConvertor();
    vi.spyOn(
      Intl.DateTimeFormat().resolvedOptions(),
      'timeZone',
      'get'
    ).mockReturnValue('UTC');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('convertToTimeZone', () => {
    it('should convert a Date object to a specific timezone', () => {
      const result = convertor.convertToTimeZone(
        mockLocalDate,
        'America/New_York'
      );
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).not.toBe(mockLocalDate.toISOString());
    });

    it('should convert an ISO string to a specific timezone', () => {
      const isoString = '2025-01-01T12:00:00Z';
      const result = convertor.convertToTimeZone(isoString, 'Europe/Kyiv');
      expect(result).toBeInstanceOf(Date);
    });

    it('should throw TypeError if date is invalid', () => {
      vi.spyOn(isDateModule, 'isDate').mockReturnValue(false);
      expect(() => convertor.convertToTimeZone('invalid-date', 'UTC')).toThrow(
        'TimezoneConvertor: Invalid Date'
      );
    });

    it('should return original date and log error if timezone is invalid', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      vi.spyOn(isValidTimeZoneModule, 'isValidTimeZone').mockReturnValue(false);

      const result = convertor.convertToTimeZone(mockLocalDate, 'Invalid/Zone');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid timezone "Invalid/Zone"')
      );
      expect(result).toEqual(mockLocalDate);
    });
  });

  describe('convertToLocalTime', () => {
    it('should convert date to local time using provided timezone', () => {
      const result = convertor.convertToLocalTime(
        mockLocalDate,
        'America/New_York'
      );
      expect(result).toBeInstanceOf(Date);
    });

    it('should use local timezone if currentTimezone is not provided', () => {
      const result = convertor.convertToLocalTime(mockLocalDate);
      expect(result).toBeInstanceOf(Date);
    });

    it('should use local timezone if provided currentTimezone is invalid', () => {
      vi.spyOn(isValidTimeZoneModule, 'isValidTimeZone').mockReturnValue(false);
      const result = convertor.convertToLocalTime(
        mockLocalDate,
        'Invalid/Zone'
      );
      expect(result).toBeInstanceOf(Date);
    });

    it('should throw TypeError if date input is invalid', () => {
      vi.spyOn(isDateModule, 'isDate').mockReturnValue(false);
      expect(() => convertor.convertToLocalTime('invalid-date')).toThrow(
        'TimezoneConvertor: Invalid Date'
      );
    });
  });

  describe('isValidTimeZone helper', () => {
    it.each([
      ['UTC', true],
      ['Europe/Kyiv', true],
      ['America/New_York', true],
      ['Invalid/Zone', false],
      ['', false],
      [null, false],
      [123, false],
    ])('should return %s for timezone input: %s', (tz, expected) => {
      expect(isValidTimeZoneModule.isValidTimeZone(tz)).toBe(expected);
    });
  });

  describe('isDate helper', () => {
    it.each([
      [new Date(), true],
      [new Date('2025-01-01'), true],
      [new Date('invalid'), false],
      ['2025-01-01', false],
      [null, false],
      [undefined, false],
      [{}, false],
    ])('should return %s for input: %s', (value, expected) => {
      expect(isDateModule.isDate(value)).toBe(expected);
    });
  });
});
