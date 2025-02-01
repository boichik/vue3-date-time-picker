import { parseISO } from 'date-fns';
import { isValidTimeZone } from '@/utils/isValidTimeZone';
import { TimezoneConvertorImpl } from '@/services/timezone-convertor/TimezoneConvertor';
import type { TimezoneConvertor } from '@/services/timezone-convertor/TimezoneConvertor.interface';
import type { Mock } from 'vitest';
import { fakeTimeZone } from '@tests/mocks/utils';

vi.mock('@/utils/isValidTimeZone', () => ({
  isValidTimeZone: vi.fn(),
}));

describe('TimezoneConvertor', () => {
  let convertor: TimezoneConvertor;

  beforeEach(() => {
    convertor = new TimezoneConvertorImpl();
    vi.clearAllMocks();
  });

  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('convertToTimeZone: converts a valid date string to the specified timezone', () => {
    fakeTimeZone();
    (isValidTimeZone as Mock).mockReturnValue(true);

    const date = new Date('2025/01/01 15:00:00');
    const timeZone = 'America/New_York';

    const result = convertor.convertToTimeZone(date, timeZone);

    expect(isValidTimeZone).toHaveBeenCalledWith(timeZone);
    expect(result).toBeInstanceOf(Date);
    expect(result).toStrictEqual(new Date('2025/01/01 08:00:00'));
  });

  it('convertToTimeZone: returns the original date if an invalid timezone is provided', () => {
    (isValidTimeZone as Mock).mockReturnValue(false);

    const date = '2023-01-01T12:00:00Z';
    const timeZone = 'Invalid/Timezone';

    const result = convertor.convertToTimeZone(date, timeZone);

    expect(console.error).toHaveBeenCalled();
    expect((console.error as Mock).mock.calls[0][0]).toContain(
      `TimezoneConvertor: Invalid timezone "${timeZone}"`
    );
    expect(isValidTimeZone).toHaveBeenCalledWith(timeZone);
    expect(result).toEqual(parseISO(date));
  });

  it('convertToTimeZone: handles invalid date strings gracefully', () => {
    const invalidDate = 'invalid-date';
    const timeZone = 'America/New_York';

    (isValidTimeZone as Mock).mockReturnValue(true);

    try {
      convertor.convertToTimeZone(invalidDate, timeZone);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
      expect((e as TypeError).message).toBe('TimezoneConvertor: Invalid Date');
    }
  });

  it('convertToLocalTime: converts a valid date string to local time', () => {
    fakeTimeZone();
    (isValidTimeZone as Mock).mockReturnValue(true);

    const date = new Date(2025, 0, 1, 12);
    const currentTimeZone = 'Europe/London';
    const result = convertor.convertToLocalTime(date, currentTimeZone);

    expect(isValidTimeZone).toHaveBeenCalledWith(currentTimeZone);
    expect(result).toBeInstanceOf(Date);
    expect(result).toStrictEqual(new Date(2025, 0, 1, 14));
  });

  it('convertToLocalTime: converts a valid date object to local time', () => {
    const londonTime = new Date(2025, 0, 1, 12);

    const result = convertor.convertToLocalTime(londonTime, 'Europe/London');
    const expectedKyivTime = new Date(2025, 0, 1, 14);

    expect(result.toISOString()).toEqual(expectedKyivTime.toISOString());
  });

  it('convertToLocalTime: uses the local timezone if no currentTimezone is provided', () => {
    fakeTimeZone();

    (isValidTimeZone as Mock).mockReturnValue(false);

    const date = '2023-01-01T12:00:00Z';

    const result = convertor.convertToLocalTime(date);

    expect(result).toBeInstanceOf(Date);
  });

  it('convertToLocalTime: returns the original date if an invalid timezone is provided', () => {
    (isValidTimeZone as Mock).mockReturnValue(false);

    const date = '2023-01-01T12:00:00Z';
    const currentTimeZone = 'Invalid/Timezone';

    const result = convertor.convertToLocalTime(date, currentTimeZone);

    expect(result).toBeInstanceOf(Date);
  });

  it('convertToLocalTime: handles invalid date strings gracefully', () => {
    const invalidDate = 'invalid-date';
    const currentTimeZone = 'America/New_York';

    (isValidTimeZone as Mock).mockReturnValue(true);

    try {
      convertor.convertToLocalTime(invalidDate, currentTimeZone);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
      expect((e as TypeError).message).toBe('TimezoneConvertor: Invalid Date');
    }
  });
});
