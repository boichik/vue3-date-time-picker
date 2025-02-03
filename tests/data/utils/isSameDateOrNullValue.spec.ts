import {
  isSameDateOrNullValue,
  isSameModelValue,
} from '@/utils/isSameDateOrNullValue';

const isSameDateOrNullValueMapCase: [unknown, unknown, unknown][] = [
  [null, null, true],
  [0, 0, true],
  [12, 12, false],
  [undefined, undefined, true],
  [NaN, null, true],
  [undefined, null, true],
  [0, null, true],
  [false, null, true],
  [new Date('2024/12/12'), new Date('2024/12/12'), true],
  ['2024', '2024', false],
  [[], null, false],
  [[123], null, false],
  [['2024'], null, false],
  [{}, null, false],
  [{ a: true }, null, false],
  ['2024', null, false],
  [true, null, false],
  [[], new Date(), false],
  [[new Date()], new Date(), false],
  [['123'], new Date(), false],
  [123, new Date(), false],
  [new Date('2024'), new Date(), false],
  [{}, new Date(), false],
];

const isSameModelValueMapCase: [unknown, unknown, unknown, unknown][] = [
  // Окремі значення
  [null, null, undefined, true],
  [undefined, null, undefined, true],
  [new Date(), null, undefined, false],
  [new Date(), null, 'Europe/Kyiv', false],
  [
    new Date('2025-01-12T12:00:00Z'),
    new Date('2025-01-12T12:00:00Z'),
    undefined,
    true,
  ],
  [
    new Date('2025-01-12 10:00:00'),
    new Date('2025-01-12 17:00:00'),
    'America/New_York',
    true,
  ],
  [
    new Date('2025-01-12T12:00:00Z'),
    new Date('2025-01-12T14:00:00Z'),
    'Europe/London',
    true,
  ],
  [null, new Date('2025-01-12T12:00:00Z'), undefined, false],
  [
    [new Date('2025-01-12 14:00:00')],
    [new Date('2025-01-12 14:00:00')],
    'Europe/Kyiv',
    true,
  ],
  [
    [new Date('2025-01-12T12:00:00Z'), new Date('2025-01-13T12:00:00Z')],
    [new Date('2025-01-12T14:00:00Z'), new Date('2025-01-13T14:00:00Z')],
    'Europe/London',
    true,
  ],
  [
    [new Date('2025-01-12T12:00:00Z')],
    [new Date('2025-01-12T12:00:00Z')],
    'Europe/London',
    false,
  ],
  [
    [new Date('2025-01-12T12:00:00Z')],
    [new Date('2025-01-12T12:00:00Z'), new Date('2025-01-13T12:00:00Z')],
    undefined,
    false,
  ],
  [[null, null], [new Date(), null], null, false],
  [[null, null], [null, null], null, true],
  [[], new Date(), null, false],
  [[null], [null], 'Europe/Kyiv', true],
];

describe('Utils: isSameModelValue', () => {
  it.each(isSameDateOrNullValueMapCase)(
    'isSameDateOrNullValueMap: start - %p | end - %p',
    (start, end, expected) => {
      expect(isSameDateOrNullValue(start as Date, end as Date)).toEqual(
        expected
      );
    }
  );

  it.each(isSameModelValueMapCase)(
    'isSameModelValue: oldValue - %p | newValue - %p | timezone - %p',
    (oldValue, newValue, timezone, expected) => {
      expect(
        isSameModelValue(oldValue as Date, newValue as Date, timezone as string)
      ).toEqual(expected);
    }
  );
});
