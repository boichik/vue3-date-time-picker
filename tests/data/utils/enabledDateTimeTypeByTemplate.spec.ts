import { enabledDateTimeTypeByTemplate } from '@/utils/enabledDateTimeTypeByTemplate';

const createRetunObject = (
  years = false,
  months = false,
  days = false,
  hours = false,
  minutes = false,
  seconds = false,
  amPm = false
) => {
  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    amPm,
  };
};

const map: unknown[] = [
  [null, createRetunObject()],
  [undefined, createRetunObject()],
  [0, createRetunObject()],
  [123, createRetunObject()],
  [NaN, createRetunObject()],
  [{}, createRetunObject()],
  [{ r: {}, t: {} }, createRetunObject()],
  [[], createRetunObject()],
  [[[], []], createRetunObject()],
  [[123, 123], createRetunObject()],
  [['ymt'], createRetunObject()],
  ['', createRetunObject()],
  ['y', createRetunObject(true)],
  ['Y', createRetunObject(true)],
  ['M', createRetunObject(false, true)],
  ['D', createRetunObject(false, false, true)],
  ['d', createRetunObject(false, false, true)],
  ['HH', createRetunObject(false, false, false, true)],
  ['hh', createRetunObject(false, false, false, true)],
  ['mm', createRetunObject(false, false, false, false, true)],
  ['ss', createRetunObject(false, false, false, false, false, true)],
  ['a', createRetunObject(false, false, false, false, false, false, true)],
  [
    'YYYY/MM/DD HH:mm:ss a',
    createRetunObject(true, true, true, true, true, true, true),
  ],
];

describe('Utils: enabledDateTimeTypeByTemplate', () => {
  it.each(map)('returns %p for input %p', (input, expected) => {
    expect(enabledDateTimeTypeByTemplate(input as string)).toEqual(expected);
  });
});
