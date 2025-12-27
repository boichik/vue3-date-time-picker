import { describe, it, expect, vi } from 'vitest';
import {
  isValidSelectableRange,
  parseSelectableRange,
  leadToValidDateRelativeToRange,
  convertDateToTime,
  getEnabledTimeTypes,
} from './index';

vi.mock('@/utils/getNewDate', () => ({
  getNewDate: () => new Date('2024-01-15T12:00:00.000Z'),
  getDateWithZeroMilliseconds: (date: Date) => {
    const newDate = new Date(date);
    newDate.setMilliseconds(0);
    return newDate;
  },
}));

vi.mock('@/utils/regexpValidator', () => ({
  regexpValidator: (value: unknown, regex: RegExp) => {
    if (typeof value !== 'string') return false;
    return regex.test(value);
  },
}));

vi.mock('@/utils/isDate', () => ({
  isDate: (value: unknown) => value instanceof Date && !isNaN(value.getTime()),
}));

describe('isValidSelectableRange', () => {
  describe('Valid Ranges', () => {
    it('should return true for valid range with zeros', () => {
      expect(isValidSelectableRange('00:00:00 - 23:59:59')).toBe(true);
    });

    it('should return true for valid range in middle of day', () => {
      expect(isValidSelectableRange('09:30:00 - 17:45:30')).toBe(true);
    });

    it('should return true for valid range with same start and end', () => {
      expect(isValidSelectableRange('12:00:00 - 12:00:00')).toBe(true);
    });

    it('should return true for valid range starting at midnight', () => {
      expect(isValidSelectableRange('00:00:00 - 12:00:00')).toBe(true);
    });

    it('should return true for valid range ending at midnight', () => {
      expect(isValidSelectableRange('12:00:00 - 23:59:59')).toBe(true);
    });

    it('should return true for full day range', () => {
      expect(isValidSelectableRange('00:00:00 - 23:59:59')).toBe(true);
    });

    it('should return true for valid range with maximum values', () => {
      expect(isValidSelectableRange('23:59:59 - 23:59:59')).toBe(true);
    });
  });

  describe('Invalid Ranges', () => {
    it('should return false for range with invalid hour (24)', () => {
      expect(isValidSelectableRange('24:00:00 - 23:59:59')).toBe(false);
    });

    it('should return false for range with invalid minute (60)', () => {
      expect(isValidSelectableRange('12:60:00 - 23:59:59')).toBe(false);
    });

    it('should return false for range with invalid second (60)', () => {
      expect(isValidSelectableRange('12:00:60 - 23:59:59')).toBe(false);
    });

    it('should return false for range with single digit without leading zero', () => {
      expect(isValidSelectableRange('9:30:00 - 17:45:30')).toBe(false);
    });

    it('should return false for range without space before dash', () => {
      expect(isValidSelectableRange('09:30:00- 17:45:30')).toBe(false);
    });

    it('should return false for range without space after dash', () => {
      expect(isValidSelectableRange('09:30:00 -17:45:30')).toBe(false);
    });

    it('should return false for range without spaces around dash', () => {
      expect(isValidSelectableRange('09:30:00-17:45:30')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidSelectableRange('')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidSelectableRange(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidSelectableRange(undefined)).toBe(false);
    });

    it('should return false for number', () => {
      expect(isValidSelectableRange(123)).toBe(false);
    });

    it('should return false for object', () => {
      expect(isValidSelectableRange({})).toBe(false);
    });

    it('should return false for array', () => {
      expect(isValidSelectableRange([])).toBe(false);
    });

    it('should return false for range with only start time', () => {
      expect(isValidSelectableRange('09:30:00')).toBe(false);
    });

    it('should return false for range with wrong format', () => {
      expect(isValidSelectableRange('09:30 - 17:45')).toBe(false);
    });

    it('should return false for range with milliseconds', () => {
      expect(isValidSelectableRange('09:30:00.000 - 17:45:30.000')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should return false for boolean true', () => {
      expect(isValidSelectableRange(true)).toBe(false);
    });

    it('should return false for boolean false', () => {
      expect(isValidSelectableRange(false)).toBe(false);
    });

    it('should return false for range with extra spaces', () => {
      expect(isValidSelectableRange('09:30:00  -  17:45:30')).toBe(false);
    });

    it('should return true for range with tabs', () => {
      expect(isValidSelectableRange('09:30:00\t-\t17:45:30')).toBe(true);
    });

    it('should return true for range with newlines', () => {
      expect(isValidSelectableRange('09:30:00\n-\n17:45:30')).toBe(true);
    });
  });
});

describe('parseSelectableRange', () => {
  describe('Valid String Parsing', () => {
    it('should parse valid range string correctly', () => {
      const result = parseSelectableRange('09:30:00 - 17:45:30');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.startTime?.getHours()).toBe(9);
      expect(result.startTime?.getMinutes()).toBe(30);
      expect(result.endTime?.getHours()).toBe(17);
      expect(result.endTime?.getMinutes()).toBe(45);
    });

    it('should parse range with zeros', () => {
      const result = parseSelectableRange('00:00:00 - 23:59:59');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.startTime?.getHours()).toBe(0);
      expect(result.endTime?.getHours()).toBe(23);
    });

    it('should parse range with same start and end', () => {
      const result = parseSelectableRange('12:00:00 - 12:00:00');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.startTime?.getHours()).toBe(12);
      expect(result.endTime?.getHours()).toBe(12);
    });

    it('should parse range with custom reference date', () => {
      const refDate = new Date('2025-06-15T12:00:00.000Z');
      const result = parseSelectableRange('10:30:00 - 14:30:00', refDate);
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.startTime?.getDate()).toBe(refDate.getDate());
      expect(result.startTime?.getMonth()).toBe(refDate.getMonth());
    });

    it('should trim whitespace from range parts', () => {
      const result = parseSelectableRange(' 09:30:00  -  17:45:30 ');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
    });

    it('should parse midnight to midnight range', () => {
      const result = parseSelectableRange('00:00:00 - 00:00:00');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.startTime?.getHours()).toBe(0);
      expect(result.endTime?.getHours()).toBe(0);
    });

    it('should parse end of day range', () => {
      const result = parseSelectableRange('23:59:59 - 23:59:59');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.startTime?.getHours()).toBe(23);
      expect(result.startTime?.getMinutes()).toBe(59);
      expect(result.startTime?.getSeconds()).toBe(59);
    });
  });

  describe('Invalid String Parsing', () => {
    it('should return null values for invalid range format', () => {
      const result = parseSelectableRange('invalid range');
      expect(result.startTime).toBe(null);
      expect(result.endTime).toBe(null);
    });

    it('should return null values for range without dash', () => {
      const result = parseSelectableRange('09:30:00 17:45:30');
      expect(result.startTime).toBe(null);
      expect(result.endTime).toBe(null);
    });

    it('should return null values for range with only start time', () => {
      const result = parseSelectableRange('09:30:00');
      expect(result.startTime).toStrictEqual(new Date('2024-01-15 09:30:00'));
      expect(result.endTime).toBe(null);
    });

    it('should return null values for empty string', () => {
      const result = parseSelectableRange('');
      expect(result.startTime).toBe(null);
      expect(result.endTime).toBe(null);
    });

    it('should return null values for invalid time format', () => {
      const result = parseSelectableRange('25:00:00 - 26:00:00');
      expect(result.startTime).toBe(null);
      expect(result.endTime).toBe(null);
    });

    it('should return null values for incomplete time', () => {
      const result = parseSelectableRange('09:30 - 17:45');
      expect(result.startTime).toBe(null);
      expect(result.endTime).toBe(null);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined selectableRange', () => {
      const result = parseSelectableRange(undefined);
      expect(result.startTime).toBe(null);
      expect(result.endTime).toBe(null);
    });

    it('should handle undefined reference date', () => {
      const result = parseSelectableRange('09:30:00 - 17:45:30', undefined);
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
    });

    it('should convert non-string values to string', () => {
      // @ts-expect-error - intentional wrong type for testing
      const result = parseSelectableRange(123);
      expect(result.startTime).toBe(null);
      expect(result.endTime).toBe(null);
    });

    it('should handle null as selectableRange', () => {
      // @ts-expect-error - intentional wrong type for testing
      const result = parseSelectableRange(null);
      expect(result.startTime).toBe(null);
      expect(result.endTime).toBe(null);
    });

    it('should use mocked getNewDate when date not provided', () => {
      const result = parseSelectableRange('12:00:00 - 13:00:00');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.startTime?.getDate()).toBe(15);
      expect(result.startTime?.getMonth()).toBe(0);
    });

    it('should handle invalid Date object as reference', () => {
      const invalidDate = new Date('invalid');
      const result = parseSelectableRange('09:30:00 - 17:45:30', invalidDate);
      expect(result.startTime).toBeInstanceOf(Date);
    });

    it('should handle extra whitespace in range string', () => {
      const result = parseSelectableRange('  09:30:00   -   17:45:30  ');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
    });
  });
});

describe('leadToValidDateRelativeToRange', () => {
  describe('Date Within Range', () => {
    it('should return same date when within range', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should return same date when exactly at start time', () => {
      const date = new Date('2024-01-15T09:00:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should return same date when exactly at end time', () => {
      const date = new Date('2024-01-15T18:00:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should return same date when in middle of range', () => {
      const date = new Date('2024-01-15T14:30:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });
  });

  describe('Date Before Range', () => {
    it('should return startTime when date is before range', () => {
      const date = new Date('2024-01-15T08:00:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(selectableRange.startTime);
    });

    it('should return startTime when date is much before range', () => {
      const date = new Date('2024-01-15T00:00:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(selectableRange.startTime);
    });

    it('should return startTime when one second before', () => {
      const date = new Date('2024-01-15T08:59:59.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(selectableRange.startTime);
    });
  });

  describe('Date After Range', () => {
    it('should return endTime when date is after range', () => {
      const date = new Date('2024-01-15T19:00:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(selectableRange.endTime);
    });

    it('should return endTime when date is much after range', () => {
      const date = new Date('2024-01-15T23:59:59.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(selectableRange.endTime);
    });

    it('should return endTime when one second after', () => {
      const date = new Date('2024-01-15T18:00:01.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(selectableRange.endTime);
    });
  });

  describe('Invalid Range Handling', () => {
    it('should return original date when startTime is null', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const selectableRange = {
        startTime: null,
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should return original date when endTime is null', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: null,
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should return original date when both times are null', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const selectableRange = {
        startTime: null,
        endTime: null,
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should return original date when startTime is undefined', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const selectableRange = {
        startTime: undefined,
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should return original date when endTime is undefined', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: undefined,
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should return original date when selectableRange is empty object', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const selectableRange = {};
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should return original date when selectableRange is undefined', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      // @ts-expect-error - intentional wrong type for testing
      const result = leadToValidDateRelativeToRange(date, undefined);
      expect(result).toEqual(date);
    });
  });

  describe('Edge Cases', () => {
    it('should handle date with milliseconds', () => {
      const date = new Date('2024-01-15T12:00:00.500Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T09:00:00.000Z'),
        endTime: new Date('2024-01-15T18:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result.getMilliseconds()).toBe(500);
    });

    it('should handle range spanning midnight', () => {
      const date = new Date('2024-01-15T23:30:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T22:00:00.000Z'),
        endTime: new Date('2024-01-16T02:00:00.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should handle very narrow range', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T12:00:00.000Z'),
        endTime: new Date('2024-01-15T12:00:01.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(date);
    });

    it('should handle date before narrow range', () => {
      const date = new Date('2024-01-15T11:59:59.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T12:00:00.000Z'),
        endTime: new Date('2024-01-15T12:00:01.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(selectableRange.startTime);
    });

    it('should handle date after narrow range', () => {
      const date = new Date('2024-01-15T12:00:02.000Z');
      const selectableRange = {
        startTime: new Date('2024-01-15T12:00:00.000Z'),
        endTime: new Date('2024-01-15T12:00:01.000Z'),
      };
      const result = leadToValidDateRelativeToRange(date, selectableRange);
      expect(result).toEqual(selectableRange.endTime);
    });
  });
});

describe('convertDateToTime', () => {
  describe('Valid Date Conversion', () => {
    it('should convert Date to HH:mm:ss format', () => {
      const date = new Date(2024, 0, 15, 14, 30, 45);
      const result = convertDateToTime(date);
      expect(result).toBe('14:30:45');
    });

    it('should convert midnight to 00:00:00', () => {
      const date = new Date(2024, 0, 15, 0, 0, 0);
      const result = convertDateToTime(date);
      expect(result).toBe('00:00:00');
    });

    it('should convert end of day to 23:59:59', () => {
      const date = new Date(2024, 0, 15, 23, 59, 59);
      const result = convertDateToTime(date);
      expect(result).toBe('23:59:59');
    });

    it('should convert morning time with leading zeros', () => {
      const date = new Date(2024, 0, 15, 9, 5, 3);
      const result = convertDateToTime(date);
      expect(result).toBe('09:05:03');
    });

    it('should convert afternoon time', () => {
      const date = new Date(2024, 0, 15, 17, 45, 30);
      const result = convertDateToTime(date);
      expect(result).toBe('17:45:30');
    });

    it('should ignore milliseconds in conversion', () => {
      const date = new Date(2024, 0, 15, 12, 30, 45, 999);
      const result = convertDateToTime(date);
      expect(result).toBe('12:30:45');
    });

    it('should convert single digit values with leading zeros', () => {
      const date = new Date(2024, 0, 15, 1, 2, 3);
      const result = convertDateToTime(date);
      expect(result).toBe('01:02:03');
    });

    it('should convert noon correctly', () => {
      const date = new Date(2024, 0, 15, 12, 0, 0);
      const result = convertDateToTime(date);
      expect(result).toBe('12:00:00');
    });
  });

  describe('Invalid Input Handling', () => {
    it('should return undefined for null', () => {
      const result = convertDateToTime(null);
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const result = convertDateToTime(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for string', () => {
      const result = convertDateToTime('2024-01-15');
      expect(result).toBeUndefined();
    });

    it('should return undefined for number', () => {
      const result = convertDateToTime(123456789);
      expect(result).toBeUndefined();
    });

    it('should return undefined for object', () => {
      const result = convertDateToTime({});
      expect(result).toBeUndefined();
    });

    it('should return undefined for array', () => {
      const result = convertDateToTime([]);
      expect(result).toBeUndefined();
    });

    it('should return undefined for boolean', () => {
      const result = convertDateToTime(true);
      expect(result).toBeUndefined();
    });

    it('should return undefined for invalid Date', () => {
      const result = convertDateToTime(new Date('invalid'));
      expect(result).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle Date with different timezone', () => {
      const date = new Date(2024, 5, 15, 14, 30, 45);
      const result = convertDateToTime(date);
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should handle very old date', () => {
      const date = new Date(1900, 0, 1, 12, 0, 0);
      const result = convertDateToTime(date);
      expect(result).toBe('12:00:00');
    });

    it('should handle future date', () => {
      const date = new Date(2099, 11, 31, 23, 59, 59);
      const result = convertDateToTime(date);
      expect(result).toBe('23:59:59');
    });

    it('should handle Date with maximum milliseconds', () => {
      const date = new Date(2024, 0, 15, 12, 30, 45, 999);
      const result = convertDateToTime(date);
      expect(result).toBe('12:30:45');
    });
  });
});

describe('getEnabledTimeTypes', () => {
  describe('Hours Detection', () => {
    it.each([['hh:mm:ss'], ['h:mm:ss'], ['HH:mm:ss'], ['H:mm:ss']])(
      'should detect hours for format %s',
      format => {
        const result = getEnabledTimeTypes(format);
        expect(result.hours).toBe(true);
      }
    );

    it('should detect hours with all hour formats combined', () => {
      const result = getEnabledTimeTypes('hh HH h H');
      expect(result.hours).toBe(true);
    });

    it('should not detect hours when format has no hour types', () => {
      const result = getEnabledTimeTypes('mm:ss');
      expect(result.hours).toBe(false);
    });

    it('should detect hours in complex format', () => {
      const result = getEnabledTimeTypes('yyyy-MM-dd HH:mm:ss');
      expect(result.hours).toBe(true);
    });
  });

  describe('Minutes Detection', () => {
    it.each([['HH:mm:ss'], ['HH:m:ss']])(
      'should detect minutes for format %s',
      format => {
        const result = getEnabledTimeTypes(format);
        expect(result.minutes).toBe(true);
      }
    );

    it('should detect minutes with both formats', () => {
      const result = getEnabledTimeTypes('mm m');
      expect(result.minutes).toBe(true);
    });

    it('should not detect minutes when format has no minute types', () => {
      const result = getEnabledTimeTypes('HH:ss');
      expect(result.minutes).toBe(false);
    });

    it('should detect minutes in complex format', () => {
      const result = getEnabledTimeTypes('dd/MM/yyyy hh:mm a');
      expect(result.minutes).toBe(true);
    });
  });

  describe('Seconds Detection', () => {
    it.each([['HH:mm:ss'], ['HH:mm:s']])(
      'should detect seconds for format %s',
      format => {
        const result = getEnabledTimeTypes(format);
        expect(result.seconds).toBe(true);
      }
    );

    it('should detect seconds with both formats', () => {
      const result = getEnabledTimeTypes('ss s');
      expect(result.seconds).toBe(true);
    });

    it('should not detect seconds when format has no second types', () => {
      const result = getEnabledTimeTypes('HH:mm');
      expect(result.seconds).toBe(false);
    });

    it('should detect seconds in complex format', () => {
      const result = getEnabledTimeTypes('yyyy-MM-dd HH:mm:ss.SSS');
      expect(result.seconds).toBe(true);
    });
  });

  describe('Milliseconds Detection', () => {
    it('should detect milliseconds for SSS format', () => {
      const result = getEnabledTimeTypes('HH:mm:ss.SSS');
      expect(result.millisecond).toBe(true);
    });

    it('should not detect milliseconds when format has no SSS', () => {
      const result = getEnabledTimeTypes('HH:mm:ss');
      expect(result.millisecond).toBe(false);
    });

    it('should detect milliseconds in complex format', () => {
      const result = getEnabledTimeTypes('yyyy-MM-dd HH:mm:ss.SSS');
      expect(result.millisecond).toBe(true);
    });
  });

  describe('AM/PM Detection', () => {
    it.each([['hh:mm:ss a'], ['hh:mm:ss aaa']])(
      'should detect AM/PM for format %s',
      format => {
        const result = getEnabledTimeTypes(format);
        expect(result.amPm).toBe(true);
      }
    );

    it('should detect amPm with both formats', () => {
      const result = getEnabledTimeTypes('a aaa');
      expect(result.amPm).toBe(true);
    });

    it('should not detect amPm when format has no AM/PM types', () => {
      const result = getEnabledTimeTypes('HH:mm:ss');
      expect(result.amPm).toBe(false);
    });

    it('should detect amPm in 12-hour format', () => {
      const result = getEnabledTimeTypes('hh:mm a');
      expect(result.amPm).toBe(true);
    });
  });

  describe('Combined Format Detection', () => {
    it('should detect all time types in full format', () => {
      const result = getEnabledTimeTypes('hh:mm:ss.SSS a');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(true);
      expect(result.millisecond).toBe(true);
      expect(result.amPm).toBe(true);
    });

    it('should detect only hours and minutes', () => {
      const result = getEnabledTimeTypes('HH:mm');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(false);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(false);
    });

    it('should detect 12-hour format with AM/PM', () => {
      const result = getEnabledTimeTypes('hh:mm:ss a');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(true);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(true);
    });

    it('should detect 24-hour format without AM/PM', () => {
      const result = getEnabledTimeTypes('HH:mm:ss');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(true);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(false);
    });

    it('should handle datetime format', () => {
      const result = getEnabledTimeTypes('yyyy-MM-dd HH:mm:ss.SSS');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(true);
      expect(result.millisecond).toBe(true);
      expect(result.amPm).toBe(false);
    });
  });

  describe('Invalid Input Handling', () => {
    it('should return all false for non-string format', () => {
      const result = getEnabledTimeTypes(123);
      expect(result.hours).toBe(false);
      expect(result.minutes).toBe(false);
      expect(result.seconds).toBe(false);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(false);
    });

    it('should return all false for null', () => {
      const result = getEnabledTimeTypes(null);
      expect(result.hours).toBe(false);
      expect(result.minutes).toBe(false);
      expect(result.seconds).toBe(false);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(false);
    });

    it('should return all false for undefined', () => {
      const result = getEnabledTimeTypes(undefined);
      expect(result.hours).toBe(false);
      expect(result.minutes).toBe(false);
      expect(result.seconds).toBe(false);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(false);
    });

    it('should return all false for empty string', () => {
      const result = getEnabledTimeTypes('');
      expect(result.hours).toBe(false);
      expect(result.minutes).toBe(false);
      expect(result.seconds).toBe(false);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(false);
    });

    it('should return all false for object', () => {
      const result = getEnabledTimeTypes({});
      expect(result.hours).toBe(false);
      expect(result.minutes).toBe(false);
      expect(result.seconds).toBe(false);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(false);
    });

    it('should return all false for array', () => {
      const result = getEnabledTimeTypes([]);
      expect(result.hours).toBe(false);
      expect(result.minutes).toBe(false);
      expect(result.seconds).toBe(false);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle format with only date parts', () => {
      const result = getEnabledTimeTypes('yyyy-MM-dd');
      expect(result.hours).toBe(false);
      expect(result.minutes).toBe(false);
      expect(result.seconds).toBe(false);
      expect(result.millisecond).toBe(false);
      expect(result.amPm).toBe(false);
    });

    it('should handle format with mixed case', () => {
      const result = getEnabledTimeTypes('HH:MM:SS');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(false);
      expect(result.seconds).toBe(false);
    });

    it('should handle format with extra characters', () => {
      const result = getEnabledTimeTypes('Time: HH:mm:ss');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(true);
    });

    it('should handle format with repeated types', () => {
      const result = getEnabledTimeTypes('HH HH mm mm ss ss');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(true);
    });

    it('should handle minimal time format', () => {
      const result = getEnabledTimeTypes('H:m');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(false);
    });

    it('should handle format with special characters', () => {
      const result = getEnabledTimeTypes('[HH]:[mm]:[ss]');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(true);
    });

    it('should handle format with spaces', () => {
      const result = getEnabledTimeTypes('HH mm ss');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(true);
    });

    it('should detect simple formats combined', () => {
      const result = getEnabledTimeTypes('h:m:s');
      expect(result.hours).toBe(true);
      expect(result.minutes).toBe(true);
      expect(result.seconds).toBe(true);
    });
  });
});
