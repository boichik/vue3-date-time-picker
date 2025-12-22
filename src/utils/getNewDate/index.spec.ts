import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getDateWithZeroMilliseconds,
  getDayEnd,
  getDayStart,
  getNewDate,
} from './index';
import {
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_SECOND,
} from '@/const/time.const';

describe('getNewDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getNewDate', () => {
    it('should return a Date instance', () => {
      const result = getNewDate();
      expect(result).toBeInstanceOf(Date);
    });

    it('should set milliseconds to zero', () => {
      const mockDate = new Date('2025-05-20T10:30:45.789');
      vi.setSystemTime(mockDate);

      const result = getNewDate();

      expect(result.getMilliseconds()).toBe(0);
    });

    it('should preserve year, month, day, hour, minute, and second', () => {
      const mockDate = new Date(2025, 4, 20, 10, 30, 45, 999);
      vi.setSystemTime(mockDate);

      const result = getNewDate();

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(20);
      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(45);
    });

    it('should return the current time according to the system clock', () => {
      const specificTime = new Date('2023-01-01T12:00:00.000Z');
      vi.setSystemTime(specificTime);

      const result = getNewDate();
      expect(result.getTime()).toBe(specificTime.getTime());
    });
  });

  describe('getDateWithZeroMilliseconds', () => {
    it('should return a new date with zero milliseconds if no argument is provided', () => {
      const mockDate = new Date('2025-05-20T10:30:45.789');
      vi.setSystemTime(mockDate);

      const result = getDateWithZeroMilliseconds();

      expect(result).toBeInstanceOf(Date);
      expect(result.getMilliseconds()).toBe(0);
      expect(result.getSeconds()).toBe(45);
    });

    it('should set milliseconds to zero for a provided valid date', () => {
      const inputDate = new Date('2025-05-20T10:30:45.789');
      const result = getDateWithZeroMilliseconds(inputDate);

      expect(result).toBe(inputDate);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should return a new date if provided value is undefined', () => {
      const result = getDateWithZeroMilliseconds(undefined);
      expect(result).toBeInstanceOf(Date);
    });

    it('should return a new date if provided value is not a valid Date object', () => {
      // @ts-expect-error Testing invalid input
      const result = getDateWithZeroMilliseconds('invalid-date');
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('getDayStart', () => {
    it('should return the timestamp of the start of the day (00:00:00.000)', () => {
      const date = new Date(2025, 4, 20, 15, 30, 45);
      const expectedStart = new Date(2025, 4, 20, 0, 0, 0, 0).getTime();

      const result = getDayStart(date);

      expect(result).toBe(expectedStart);
    });

    it('should handle dates at the end of the month correctly', () => {
      const date = new Date(2025, 0, 31, 23, 59, 59);
      const expectedStart = new Date(2025, 0, 31, 0, 0, 0, 0).getTime();

      expect(getDayStart(date)).toBe(expectedStart);
    });
  });

  describe('getDayEnd', () => {
    it('should return the timestamp of the end of the day (23:59:59.000)', () => {
      const date = new Date(2025, 4, 20, 10, 0, 0);

      const startOfDay = new Date(2025, 4, 20, 0, 0, 0, 0).getTime();
      const expectedEnd =
        startOfDay + MILLISECONDS_IN_DAY - MILLISECONDS_IN_SECOND;

      const result = getDayEnd(date);

      expect(result).toBe(expectedEnd);
    });

    it('should correspond to 23:59:59 of the given date', () => {
      const date = new Date(2025, 4, 20);
      const resultTimestamp = getDayEnd(date);
      const resultDate = new Date(resultTimestamp);

      expect(resultDate.getFullYear()).toBe(2025);
      expect(resultDate.getMonth()).toBe(4);
      expect(resultDate.getDate()).toBe(20);
      expect(resultDate.getHours()).toBe(23);
      expect(resultDate.getMinutes()).toBe(59);
      expect(resultDate.getSeconds()).toBe(59);
      expect(resultDate.getMilliseconds()).toBe(0);
    });
  });
});
