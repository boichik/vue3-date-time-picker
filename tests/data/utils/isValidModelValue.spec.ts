import { isValidModelValue } from '@/utils/isValidModelValue';

const isValidModelValueCases: unknown[] = [
  [null, undefined, true],
  [null, { onlySingle: true }, true],
  [null, { onlyRange: true }, false],

  [new Date('2025-01-12T12:00:00Z'), undefined, true],
  [new Date('invalid-date'), undefined, false],
  [new Date('2025-01-12T12:00:00Z'), { onlySingle: true }, true],
  [new Date('2025-01-12T12:00:00Z'), { onlyRange: true }, false],

  [[new Date('2025-01-12T12:00:00Z'), null], undefined, true],
  [
    [new Date('2025-01-12T12:00:00Z'), new Date('2025-01-13T12:00:00Z')],
    undefined,
    true,
  ],
  [
    [new Date('2025-01-12T12:00:00Z'), new Date('invalid-date')],
    undefined,
    false,
  ],
  [[new Date('2025-01-12T12:00:00Z'), null], { onlyRange: true }, true],
  [[new Date('2025-01-12T12:00:00Z'), null], { onlySingle: true }, false],
  [[null, null], undefined, true],
  [[null, null], { onlySingle: true }, false],
  [[null, null], { onlyRange: true }, true],

  ['2025-01-12', undefined, false],
  [42, undefined, false],
  [{}, undefined, false],
  [['2025-01-12', new Date('2025-01-12T12:00:00Z')], undefined, false],
  [['invalid', 'values'], undefined, false],
  [123435467, undefined, false],
  [NaN, undefined, false],
];

describe('Utils: isValidModelValue', () => {
  it.each(isValidModelValueCases)(
    'returns %p for value %p with options %p',
    (value, options, expected) => {
      expect(isValidModelValue(value, options)).toBe(expected);
    }
  );
});
