import { isDate } from '@/utils/isDate';

const map: unknown[] = [
  ['2025-01-12', false],
  ['2025', false],
  ['2025/12', false],
  ['2025/12/12', false],
  ['2025/12/12/12', false],
  ['invalid date', false],
  [1234567890, false],
  [NaN, false],
  [null, false],
  [undefined, false],
  [new Date('sniudnu'), false],
  [new Date(), true],
  [new Date('2025/12/12'), true],
  [new Date(1234567890), true],
];

describe('Utils: isDate', () => {
  it.each(map)('returns %p for input %p', (input, expected) => {
    expect(isDate(input)).toEqual(expected);
  });
});
