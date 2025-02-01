import {
  isValidDefaultTime,
  isValidFirstDayOfWeek,
  isValidMonthFormat,
  isValidType,
  isValidWeekdayFormat,
  setTime,
} from '@/components/app-date-time-picker/src/utils';

describe('AppDateTimePicker Utils', () => {
  const setTimeTestCase: any[] = [
    [new Date(2025, 0, 1), '12', undefined, new Date(2025, 0, 1, 12)],
    [new Date(2025, 0, 1), '12:30', undefined, new Date(2025, 0, 1, 12, 30)],
    [
      new Date(2025, 0, 1),
      '12:30:40',
      undefined,
      new Date(2025, 0, 1, 12, 30, 40),
    ],
    [new Date(2025, 0, 1), '123', undefined, new Date(2025, 0, 6, 3)],
    [new Date(2025, 0, 1), 'abc123', undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), 'abc', undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), null, undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), undefined, undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), NaN, undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), 0, undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), 12, undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), {}, undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [null], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [undefined], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [NaN], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [0], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [12], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [{}], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [[]], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [''], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), ['abc'], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), ['12'], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), ['12:30'], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), ['12:30:30'], undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), ['12:30:30'], 0, new Date(2025, 0, 1, 12, 30, 30)],
    [new Date(2025, 0, 1), ['12:30:30'], 1, new Date(2025, 0, 1)],
    [
      new Date(2025, 0, 1),
      ['12:30:30', '15:28'],
      1,
      new Date(2025, 0, 1, 15, 28),
    ],
    [new Date(2025, 0, 1), [null], 0, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [undefined], 0, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [12], 0, new Date(2025, 0, 1)],
  ];

  it.each(setTimeTestCase)(
    'setTime: date= %p; time= %p; index= %p; result= %p',
    (date, time, index, result) => {
      expect(setTime(date, time, index)).toStrictEqual(result);
    }
  );

  const isValidTypeTestCase: any[] = [
    [0, false],
    [1, false],
    [123, false],
    ['', false],
    ['abc', false],
    ['12b', false],
    [true, false],
    [false, false],
    [null, false],
    [undefined, false],
    [NaN, false],
    [[], false],
    [['123'], false],
    [{ 1: '123' }, false],
    ['Date', false],
    ['Daterange', false],
    ['Datetime', false],
    ['Datetimerange', false],
    ['date', true],
    ['daterange', true],
    ['datetime', true],
    ['datetimerange', true],
  ];

  it.each(isValidTypeTestCase)(
    'isValidType: value= %p; result= %p',
    (value, result) => {
      expect(isValidType(value)).toBe(result);
    }
  );

  const isValidFirstDayOfWeekTestCase: any[] = [
    [true, false],
    [true, false],
    [[], false],
    [{}, false],
    [null, false],
    [undefined, false],
    [NaN, false],
    ['', false],
    ['abc', false],
    ['1', false],
    ['2', false],
    ['3', false],
    ['4', false],
    ['5', false],
    ['6', false],
    ['7', false],
    ['8', false],
    ['9', false],
    ['10', false],
    [1, true],
    [2, true],
    [3, true],
    [4, true],
    [5, true],
    [6, true],
    [7, true],
    [8, false],
    [9, false],
    [10, false],
  ];

  it.each(isValidFirstDayOfWeekTestCase)(
    'isValidFirstDayOfWeek: value= %p; result= %p',
    (value, result) => {
      expect(isValidFirstDayOfWeek(value)).toBe(result);
    }
  );

  const isValidDefaultTimeTestCase: any[] = [
    [false, false],
    [true, false],
    [{}, false],
    [[], false],
    ['123', false],
    ['abc', false],
    ['12:30', false],
    ['23:60', false],
    ['24:00', false],
    ['99:99', false],
    ['23:59:60', false],
    ['99:99:99', false],
    [null, false],
    [undefined, false],
    [NaN, false],
    [0, false],
    [12, false],
    [123030, false],
    [[false], false],
    [[true], false],
    [[{}], false],
    [[[]], false],
    [['12'], false],
    [['abc'], false],
    [[0], false],
    [[12], false],
    [['12:30'], false],
    [['23:60'], false],
    [['24:00'], false],
    [['99:99'], false],
    [['23:59:60'], false],
    [['99:99:99'], false],
    [['23:23:23', '99:99:99'], false],
    [['23:23:23', '23:59:60'], false],
    [['23:23:23', '23:59:59'], true],
    [['23:23:23'], true],
    ['23:23:23', true],
    ['00:00:00', true],
    ['05:59:59', true],
  ];

  it.each(isValidDefaultTimeTestCase)(
    'isValidDefaultTime: value= %p; result= %p',
    (value, result) => {
      expect(isValidDefaultTime(value)).toBe(result);
    }
  );

  const isValidWeekdayFormatTestCase: any[] = [
    [false, false],
    [true, false],
    [[], false],
    [{}, false],
    ['', false],
    ['123', false],
    ['abc', false],
    ['null', false],
    [undefined, false],
    [null, false],
    [NaN, false],
    [0, false],
    [123, false],
    [['abcd'], false],
    ['long', true],
    ['short', true],
    ['narrow', true],
  ];

  it.each(isValidWeekdayFormatTestCase)(
    'isValidWeekdayFormat: value= %p; result= %p',
    (value, result) => {
      expect(isValidWeekdayFormat(value)).toBe(result);
    }
  );

  const isValidMonthFormatTestCase: any[] = [
    [false, false],
    [true, false],
    [[], false],
    [{}, false],
    ['', false],
    ['123', false],
    ['abc', false],
    ['null', false],
    [undefined, false],
    [null, false],
    [NaN, false],
    [0, false],
    [123, false],
    [['abcd'], false],
    ['long', true],
    ['short', true],
    ['narrow', true],
    ['numeric', true],
    ['2-digit', true],
  ];

  it.each(isValidMonthFormatTestCase)(
    'isValidMonthFormat: value= %p; result= %p',
    (value, result) => {
      expect(isValidMonthFormat(value)).toBe(result);
    }
  );
});
