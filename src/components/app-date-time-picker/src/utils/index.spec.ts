import { describe, it, expect, vi } from 'vitest';
import {
  setTime,
  isDisabledMonth,
  isDisabledYear,
  isValidType,
  isValidFirstDayOfWeek,
  isValidDefaultTime,
  isValidWeekdayFormat,
  isValidMonthFormat,
  isValidMode,
} from './index';
import { set } from 'date-fns';
import { regexpValidator } from '@/utils/regexpValidator';
import { AppDateTimePickerType } from '../enums/dateTimePickerType';
import { AppDateTimePickerMode } from '../enums/dateTimePickerMode';

vi.mock('date-fns', async importOriginal => {
  const actual = await importOriginal<typeof import('date-fns')>();
  return {
    ...actual,
    set: vi.fn().mockImplementation(actual.set),
    getDaysInMonth: vi.fn().mockImplementation(actual.getDaysInMonth),
    addDays: vi.fn().mockImplementation(actual.addDays),
    addMonths: vi.fn().mockImplementation(actual.addMonths),
  };
});

vi.mock('@/utils/regexpValidator', () => ({
  regexpValidator: vi.fn(),
}));

describe('AppDateTimePicker Utils', () => {
  describe('setTime', () => {
    const date = new Date(2025, 0, 1);

    it.each([
      ['10:20:30', { hours: 10, minutes: 20, seconds: 30 }],
      ['05:15', { hours: 5, minutes: 15, seconds: 0 }],
      ['invalid', { hours: 0, minutes: 0, seconds: 0 }],
      ['', { hours: 0, minutes: 0, seconds: 0 }],
    ])('should set time for string: %s', (time, expected) => {
      setTime(date, time);
      expect(set).toHaveBeenCalledWith(date, expect.objectContaining(expected));
    });

    it('should set time from array using index', () => {
      setTime(date, ['10:00', '11:00'], 1);
      expect(set).toHaveBeenCalledWith(
        date,
        expect.objectContaining({ hours: 11 })
      );
    });
  });

  describe('isDisabledMonth', () => {
    const date = new Date(2025, 0, 1);

    it('should return false if no callback provided', () => {
      expect(isDisabledMonth(date)).toBe(false);
    });

    it('should return true if first day callback returns true', () => {
      const fn = vi.fn().mockReturnValue(true);
      expect(isDisabledMonth(date, fn)).toBe(true);
      expect(fn).toHaveBeenCalled();
    });

    it('should return false if first day callback returns false', () => {
      const fn = vi.fn().mockReturnValue(false);
      expect(isDisabledMonth(date, fn)).toBe(false);
    });
  });

  describe('isDisabledYear', () => {
    const date = new Date(2025, 0, 1);

    it('should return false if no callback provided', () => {
      expect(isDisabledYear(date)).toBe(false);
    });

    it('should return true if first day of first month is disabled', () => {
      const fn = vi.fn().mockReturnValue(true);
      expect(isDisabledYear(date, fn)).toBe(true);
    });
  });

  describe('isValidType', () => {
    it.each([
      [AppDateTimePickerType.Date, true],
      ['invalid', false],
      [123, false],
      [null, false],
    ])('should validate type %s as %s', (val, expected) => {
      expect(isValidType(val)).toBe(expected);
    });
  });

  describe('isValidFirstDayOfWeek', () => {
    it.each([
      [1, true],
      [7, true],
      [0, false],
      [8, false],
      ['1', false],
    ])('should validate %s as %s', (val, expected) => {
      expect(isValidFirstDayOfWeek(val)).toBe(expected);
    });
  });

  describe('isValidDefaultTime', () => {
    it('should validate single string via regexpValidator', () => {
      vi.mocked(regexpValidator).mockReturnValue(true);
      expect(isValidDefaultTime('10:00')).toBe(true);
      expect(regexpValidator).toHaveBeenCalled();
    });

    it('should validate array of strings', () => {
      vi.mocked(regexpValidator).mockReturnValue(true);
      expect(isValidDefaultTime(['10:00', '11:00'])).toBe(true);
      expect(regexpValidator).toHaveBeenCalledTimes(3);
    });

    it('should return false if any item in array fails validation', () => {
      vi.mocked(regexpValidator)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      expect(isValidDefaultTime(['10:00', 'invalid'])).toBe(false);
    });
  });

  describe('isValidWeekdayFormat', () => {
    it.each([
      ['long', true],
      ['short', true],
      ['narrow', true],
      ['numeric', false],
      [null, false],
    ])('should validate weekday format %s as %s', (val, expected) => {
      expect(isValidWeekdayFormat(val)).toBe(expected);
    });
  });

  describe('isValidMonthFormat', () => {
    it.each([
      ['long', true],
      ['2-digit', true],
      ['numeric', true],
      ['invalid', false],
    ])('should validate month format %s as %s', (val, expected) => {
      expect(isValidMonthFormat(val)).toBe(expected);
    });
  });

  describe('isValidMode', () => {
    it.each([
      [AppDateTimePickerMode.Day, true],
      ['random', false],
      [undefined, false],
    ])('should validate mode %s as %s', (val, expected) => {
      expect(isValidMode(val)).toBe(expected);
    });
  });
});
