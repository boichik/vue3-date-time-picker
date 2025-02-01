import {
  convertDateToTime,
  getEnabledTimeTypes,
  isValidSelectableRange,
  leadToValidDateRelativeToRange,
  parseSelectableRange,
} from '@/components/app-time-picker/src/utils';
import { isDate } from '@/utils/isDate';
import { set } from 'date-fns';

describe('AppTimePicker Utils', () => {
  const isValidSelectableRangeTestCase: any[] = [
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
    ['12:30:30', false],
    ['12:30:30 -', false],
    ['12:30:30 - 12', false],
    ['12:30:30 - 12:30', false],
    ['12:30:30 - 12:30:60', false],
    ['28:30:30 - 12:30:30', false],
    ['24:00:00 - 12:30:30', false],
    ['23:00:00 - 12:60:30', false],
    ['00:00:00 -12:30:30', false],
    ['00:00:00-12:30:30', false],
    ['00:00:00- 12:30:30', false],
    ['00:00:00 - 12:30:301', false],
    ['00:00:00 - 12:30:30a', false],
    ['00:00:00 - 12:30:30', true],
    ['00:00:00 - 23:30:30', true],
    ['00:00:00 - 23:59:59', true],
    ['23:59:59 - 23:59:59', true],
  ];

  it.each(isValidSelectableRangeTestCase)(
    'isValidSelectableRange: value= %p; result= %p',
    (value, result) => {
      expect(isValidSelectableRange(value)).toBe(result);
    }
  );

  const parseSelectableRangeTestCase: any[] = [
    [false, false, false],
    [true, false, false],
    [[], false, false],
    [{}, false, false],
    ['', false, false],
    ['123', false, false],
    ['abc', false, false],
    ['null', false, false],
    [undefined, false, false],
    [null, false, false],
    [NaN, false, false],
    [0, false, false],
    [123, false, false],
    ['28:30:12', false, false],
    ['12:60:12', false, false],
    ['12:59:60', false, false],
    ['a2:59:59', false, false],
    ['12:5b:59', false, false],
    ['12:58:5b', false, false],
    ['12:30:12', true, false],
    ['12:30:12-', true, false],
    ['12:30:12-12', true, false],
    ['12:30:12-12:30', true, false],
    ['12:30:12-24:30:30', true, false],
    ['12:30:12-23:60:30', true, false],
    ['12:30:12-23:59:60', true, false],
    ['12:30:12-2b:59:60', true, false],
    ['12:30:12-23:b9:60', true, false],
    ['12:30:12-23:59:b0', true, false],
    ['12:30:12-23:59:50', true, true],
    ['12:30:12-12:30:12', true, true],
    ['00:00:00-00:00:00', true, true],
  ];

  it.each(parseSelectableRangeTestCase)(
    'parseSelectableRange: value= %p; startTime is Date= %p; endTime is Date= %p',
    (value, startIsDate, endIsDate) => {
      const { startTime, endTime } = parseSelectableRange(value);

      expect(isDate(startTime)).toBe(startIsDate);
      expect(isDate(endTime)).toBe(endIsDate);
    }
  );

  it('parseSelectableRange: transfer of the reference date', () => {
    const date = new Date(2025, 2, 1);

    const referenceRange = parseSelectableRange('12:00:00-18:00:00', date);

    expect(referenceRange.startTime).toStrictEqual(new Date(2025, 2, 1, 12));
    expect(referenceRange.endTime).toStrictEqual(new Date(2025, 2, 1, 18));
  });

  it('parseSelectableRange: without of the reference date', () => {
    const withoutReferenceRange = parseSelectableRange('12:00:00-18:00:00');

    const getCurrentDateWithHour = (hour: number) => {
      return set(new Date(), {
        hours: hour,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    };

    expect(withoutReferenceRange.startTime).toStrictEqual(
      getCurrentDateWithHour(12)
    );
    expect(withoutReferenceRange.endTime).toStrictEqual(
      getCurrentDateWithHour(18)
    );
  });

  const leadToValidDateRelativeToRangeTestCase: any[] = [
    [new Date(2025, 0, 1), undefined, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), true, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), false, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), null, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), 'abc', new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), '123', new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), 123, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), NaN, new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), [], new Date(2025, 0, 1)],
    [new Date(2025, 0, 1), {}, new Date(2025, 0, 1)],
    [
      new Date(2025, 0, 1),
      { startTime: null, endTime: null },
      new Date(2025, 0, 1),
    ],
    [
      new Date(2025, 0, 1),
      { startTime: true, endTime: true },
      new Date(2025, 0, 1),
    ],
    [
      new Date(2025, 0, 1),
      { startTime: undefined, endTime: undefined },
      new Date(2025, 0, 1),
    ],
    [
      new Date(2025, 0, 1),
      { startTime: new Date(), endTime: undefined },
      new Date(2025, 0, 1),
    ],
    [
      new Date(2025, 0, 1),
      { startTime: undefined, endTime: new Date() },
      new Date(2025, 0, 1),
    ],
    [
      new Date(2025, 0, 1),
      { startTime: undefined, endTime: new Date() },
      new Date(2025, 0, 1),
    ],
    [
      new Date(2025, 0, 1),
      { startTime: new Date(2025, 0, 1), endTime: new Date(2025, 0, 1) },
      new Date(2025, 0, 1),
    ],
    [
      new Date(2025, 0, 1),
      { startTime: new Date(2025, 0, 2), endTime: new Date(2025, 0, 3) },
      new Date(2025, 0, 2),
    ],
    [
      new Date(2025, 0, 5),
      { startTime: new Date(2025, 0, 2), endTime: new Date(2025, 0, 3) },
      new Date(2025, 0, 3),
    ],
  ];

  it.each(leadToValidDateRelativeToRangeTestCase)(
    'leadToValidDateRelativeToRange: date= %p; selectableRange= %p; result= %p',
    (date, selectableRange, result) => {
      expect(
        leadToValidDateRelativeToRange(date, selectableRange)
      ).toStrictEqual(result);
    }
  );

  const convertDateToTimeTestCase: any[] = [
    [false, undefined],
    [true, undefined],
    [null, undefined],
    [undefined, undefined],
    [NaN, undefined],
    ['', undefined],
    ['abc', undefined],
    ['123', undefined],
    [123, undefined],
    [[], undefined],
    [{}, undefined],
    ['2025/01/01', undefined],
    ['2025-01-01 12:30:30', undefined],
    [new Date(2025, 1, 1, 12), '12:00:00'],
    [new Date(2025, 1, 1, 12, 30), '12:30:00'],
    [new Date(2025, 1, 1, 12, 30, 30), '12:30:30'],
  ];

  it.each(convertDateToTimeTestCase)(
    'convertDateToTime: value= %p; result= %p',
    (value, result) => {
      expect(convertDateToTime(value)).toBe(result);
    }
  );

  const createEnabledTimeTypes = (
    hours = false,
    minutes = false,
    seconds = false,
    millisecond = false,
    amPm = false
  ) => {
    return {
      hours,
      minutes,
      seconds,
      millisecond,
      amPm,
    };
  };

  const getEnabledTimeTypesTestCase: any[] = [
    [false, createEnabledTimeTypes()],
    [true, createEnabledTimeTypes()],
    [null, createEnabledTimeTypes()],
    [undefined, createEnabledTimeTypes()],
    [NaN, createEnabledTimeTypes()],
    ['', createEnabledTimeTypes()],
    ['bc', createEnabledTimeTypes()],
    ['123', createEnabledTimeTypes()],
    [123, createEnabledTimeTypes()],
    [[], createEnabledTimeTypes()],
    [{}, createEnabledTimeTypes()],
    ['h', createEnabledTimeTypes(true)],
    ['hh', createEnabledTimeTypes(true)],
    ['H', createEnabledTimeTypes(true)],
    ['HH', createEnabledTimeTypes(true)],
    ['HHm', createEnabledTimeTypes(true, true)],
    ['HHmm', createEnabledTimeTypes(true, true)],
    ['HHmms', createEnabledTimeTypes(true, true, true)],
    ['HHmmss', createEnabledTimeTypes(true, true, true)],
    ['HHmmssSSS', createEnabledTimeTypes(true, true, true, true)],
    ['HHmmssSSSa', createEnabledTimeTypes(true, true, true, true, true)],
    ['HHmmssSSSaaa', createEnabledTimeTypes(true, true, true, true, true)],
  ];

  it.each(getEnabledTimeTypesTestCase)(
    'getEnabledTimeTypes: format= %p; result= %p;',
    (format, result) => {
      expect(getEnabledTimeTypes(format)).toEqual(result);
    }
  );
});
