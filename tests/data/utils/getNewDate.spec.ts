/* global global */
import {
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_SECOND,
} from '@/const/time.const';
import {
  getNewDate,
  getDayStart,
  getDayEnd,
  getDateWithZeroMilliseconds,
} from '@/utils/getNewDate';

describe('Utils: getNewDate', () => {
  describe('getDateWithZeroMilliseconds', () => {
    const mockDate = new Date(2025, 0, 1);

    beforeAll(() => {
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    const getDateWithZeroMillisecondsTestCase: any[] = [
      [false, mockDate],
      [true, mockDate],
      [[], mockDate],
      [{}, mockDate],
      ['abc', mockDate],
      ['123', mockDate],
      ['', mockDate],
      [123, mockDate],
      [NaN, mockDate],
      [undefined, mockDate],
      [null, mockDate],
    ];

    it.each(getDateWithZeroMillisecondsTestCase)(
      'getDateWithZeroMilliseconds: input= %p; result= %p',
      (input, result) => {
        expect(getDateWithZeroMilliseconds(input)).toStrictEqual(result);
      }
    );
  });

  it('getDateWithZeroMilliseconds: set valid value', () => {
    expect(
      getDateWithZeroMilliseconds(new Date(2025, 1, 1, 12, 30, 30, 300))
    ).toStrictEqual(new Date(2025, 1, 1, 12, 30, 30, 0));
  });

  it('get current date. Returns %p for input %p', () => {
    const date = getNewDate();

    const newDate = new Date();

    newDate.setMilliseconds(0);

    expect(date).toBeInstanceOf(Date);
    expect(date).toStrictEqual(newDate);
  });

  it('returns the start of the day', () => {
    const inputDate = new Date('2025-01-12T15:30:45.123Z');
    const result = getDayStart(inputDate);

    const expected = +new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate()
    );

    expect(result).toBe(expected);
  });

  it('receiving the beginning of the day with the transmission of an incorrect value', () => {
    try {
      getDayStart(null as unknown as Date);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as TypeError).message).toBe(
        "Cannot read properties of null (reading 'getDate')"
      );
    }
  });

  it('returns the end of the day', () => {
    const inputDate = new Date('2025-01-12T15:30:45.123Z');
    const result = getDayEnd(inputDate);

    const expected =
      +new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ) +
      MILLISECONDS_IN_DAY -
      MILLISECONDS_IN_SECOND;

    expect(result).toBe(expected);
  });

  it('receiving the end of the day with the transmission of an incorrect value', () => {
    try {
      getDayEnd(null as unknown as Date);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as TypeError).message).toBe(
        "Cannot read properties of null (reading 'getDate')"
      );
    }
  });
});
