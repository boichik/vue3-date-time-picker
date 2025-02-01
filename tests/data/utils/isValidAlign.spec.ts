import { isValidAlign } from '@/utils/isValidAlign';

const map: unknown[] = [
  ['left', true],
  ['center', true],
  ['right', true],
  ['top', false],
  [null, false],
  [undefined, false],
  [123, false],
  ['', false],
];

describe('Utils: isValidAlign', () => {
  it.each(map)('returns %p for input %p', (input, expected) => {
    expect(isValidAlign(input)).toEqual(expected);
  });
});
