import { parseFormat } from '@/utils/parseFormat';

const parseFormatCases: [unknown, unknown, string][] = [
  ['yyyy:mm', '', 'yyyy:mm'],
  ['yy:mm', '', 'yy:mm'],
  ['yy:MM', '', 'yy:MM'],
  ['M', '', 'M'],
  ['dd', '', 'dd'],
  ['d', '', 'd'],
  ['a', '', 'a'],
  ['aaa', '', 'aaa'],
  ['aa', '', 'aa'],
  ['h:mm:ss', 'HH:mm:ss', 'h:mm:ss'],
  ['HH:mm:ss A', 'h:mm:ss', 'HH:mm:ss A'],
  ['H:mm:ss a', 'HH:mm:ss', 'h:mm:ss a'],
  ['invalid:mm:ss', 'HH:mm:ss', 'invalid:mm:ss'],
  ['notAllowed:mm:ss', 'HH:mm:ss', 'notAllowed:mm:ss'],
  ['H:mm:ss invalid', 'HH:mm:ss', 'h:mm:ss invalid'],
  ['H:mm:ss a', 'h:mm:ss', 'h:mm:ss a'],
  ['HH:mm:ss a', 'h:mm:ss', 'hh:mm:ss a'],
  ['', 'hh', 'hh'],
  ['', 'HH a', 'hh a'],
  [123, 'HH:mm:ss', 'HH:mm:ss'],
  [null, 'HH:mm:ss', 'HH:mm:ss'],
  [undefined, 'HH:mm:ss', 'HH:mm:ss'],
  [{}, 'HH:mm:ss', 'HH:mm:ss'],
  ['X', 'hh', 'hh'],
  ['X', '', ''],
  ['X', null, ''],
  ['X', undefined, ''],
  ['X', 0, ''],
  ['X', false, ''],
];

describe('Utils: parseFormat', () => {
  it.each(parseFormatCases)(
    'returns "%s" for format "%s" with default "%s"',
    (format, defaultFormat, expected) => {
      expect(parseFormat(format, defaultFormat as string)).toBe(expected);
    }
  );
});
