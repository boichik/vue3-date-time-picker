import { isValidTimeZone } from '@/utils/isValidTimeZone';

const map: unknown[] = [
  ['UTC', true],
  ['Europe/Kyiv', true],
  ['Invalid/TimeZone', false],
  [null, false],
  [undefined, false],
  [123, false],
  ['', false],
];

describe('Utils: isValidTimeZone', () => {
  it.each(map)('returns %p for input %p', (input, expected) => {
    expect(isValidTimeZone(input)).toEqual(expected);
  });
});
