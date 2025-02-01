import { getObject } from '@/utils/getObject';

const map: unknown[] = [
  [{ key: 'value' }, { key: 'value' }],
  [null, {}],
  [undefined, {}],
  [123, {}],
  ['string', {}],
];

describe('Utils: getObject', () => {
  it.each(map)('returns the correct object for input %p', (input, expected) => {
    const result = getObject<typeof expected>(input);
    expect(result).toEqual(expected);
  });
});
