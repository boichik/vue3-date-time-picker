import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isSameModelValue, isSameDateOrNullValue } from './index';

const convertToTimeZoneMock = vi.fn();

vi.mock('@/services/timezone-convertor', () => {
  return {
    TimezoneConvertor: vi.fn().mockImplementation(() => ({
      convertToTimeZone: convertToTimeZoneMock,
    })),
  };
});

describe('isSameDateOrNullValue', () => {
  it.each([
    [new Date(2023, 0, 1), new Date(2023, 0, 1)],
    [null, null],
    [undefined, undefined],
    [null, undefined],
    [undefined, null],
  ])('should return true for equal values: %s, %s', (start, end) => {
    expect(isSameDateOrNullValue(start, end)).toBe(true);
  });

  it.each([
    [new Date(2023, 0, 1), new Date(2023, 0, 2)],
    [new Date(2023, 0, 1), null],
    [null, new Date(2023, 0, 1)],
    [undefined, new Date(2023, 0, 1)],
  ])('should return false for different values: %s, %s', (start, end) => {
    expect(isSameDateOrNullValue(start, end)).toBe(false);
  });
});

describe('isSameModelValue', () => {
  beforeEach(() => {
    convertToTimeZoneMock.mockClear();
    convertToTimeZoneMock.mockImplementation(date => date);
  });

  it.each([
    [new Date(2023, 0, 1), new Date(2023, 0, 1)],
    [null, null],
    [[new Date(2023, 0, 1)], [new Date(2023, 0, 1)]],
    [[null], [null]],
    [[], []],
  ])(
    'should return true for equal models without timezone: %s, %s',
    (oldVal, newVal) => {
      expect(isSameModelValue(oldVal, newVal)).toBe(true);
    }
  );

  it.each([
    [new Date(2023, 0, 1), new Date(2023, 0, 2)],
    [new Date(2023, 0, 1), null],
    [[new Date(2023, 0, 1)], [new Date(2023, 0, 2)]],
    [[new Date(2023, 0, 1)], []],
    [[], [new Date(2023, 0, 1)]],
    [new Date(2023, 0, 1), [new Date(2023, 0, 1)]],
    [[new Date(2023, 0, 1)], new Date(2023, 0, 1)],
  ])(
    'should return false for different models without timezone: %s, %s',
    (oldVal, newVal) => {
      expect(isSameModelValue(oldVal, newVal)).toBe(false);
    }
  );

  it('should use timezone convertor when timezone is provided (single date)', () => {
    const oldDate = new Date('2023-01-01T10:00:00Z');
    const newDate = new Date('2023-01-01T12:00:00Z');
    const timezone = 'UTC';

    convertToTimeZoneMock.mockReturnValue(oldDate);

    const result = isSameModelValue(oldDate, newDate, timezone);

    expect(convertToTimeZoneMock).toHaveBeenCalledWith(newDate, timezone);
    expect(result).toBe(true);
  });

  it('should use timezone convertor when timezone is provided (array)', () => {
    const oldDate = new Date('2023-01-01T10:00:00Z');
    const newDate = new Date('2023-01-01T12:00:00Z');
    const timezone = 'UTC';

    convertToTimeZoneMock.mockReturnValue(oldDate);

    const result = isSameModelValue([oldDate], [newDate], timezone);

    expect(convertToTimeZoneMock).toHaveBeenCalledWith(newDate, timezone);
    expect(result).toBe(true);
  });

  it('should return false if converted date is different', () => {
    const oldDate = new Date('2023-01-01T10:00:00Z');
    const newDate = new Date('2023-01-01T12:00:00Z');
    const timezone = 'UTC';

    convertToTimeZoneMock.mockReturnValue(new Date('2023-01-01T15:00:00Z'));

    const result = isSameModelValue(oldDate, newDate, timezone);
    expect(result).toBe(false);
  });
});
