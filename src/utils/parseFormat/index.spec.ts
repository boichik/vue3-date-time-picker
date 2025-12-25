import { describe, it, expect } from 'vitest';
import { parseFormat } from './index';

describe('parseFormat', () => {
  it.each([
    ['yyyy-MM-dd', 'yyyy/MM/dd', 'yyyy-MM-dd'],
    ['HH:mm', 'HH:mm:ss', 'HH:mm'],
    ['hh:mm a', 'HH:mm', 'hh:mm a'],
    ['HH:mm a', 'HH:mm', 'hh:mm a'],
    ['H:mm a', 'HH:mm', 'h:mm a'],
    ['HH:mm aaa', 'HH:mm', 'hh:mm aaa'],
    ['H:mm aaa', 'HH:mm', 'h:mm aaa'],
    ['HH:mm', 'yyyy', 'HH:mm'],
    ['yyyy-MM-dd HH:mm:ss', 'yyyy', 'yyyy-MM-dd HH:mm:ss'],
  ])(
    'should parse valid format strings: %s',
    (format, defaultFormat, expected) => {
      expect(parseFormat(format, defaultFormat)).toBe(expected);
    }
  );

  it.each([
    [null, 'yyyy-MM-dd', 'yyyy-MM-dd'],
    [undefined, 'HH:mm', 'HH:mm'],
    [123, 'yyyy', 'yyyy'],
    [{}, 'MM-dd', 'MM-dd'],
    [[], 'yyyy', 'yyyy'],
    [true, 'yyyy', 'yyyy'],
  ])(
    'should return default format when format is not a string: %s',
    (format, defaultFormat, expected) => {
      expect(parseFormat(format, defaultFormat)).toBe(expected);
    }
  );

  it.each([
    ['XYZ', 'yyyy-MM-dd', 'yyyy-MM-dd'],
    ['   ', 'HH:mm', 'HH:mm'],
    ['QWERTY', 'MM-dd', 'MM-dd'],
  ])(
    'should return parsed default format if format does not contain any valid blocks: %s',
    (format, defaultFormat, expected) => {
      expect(parseFormat(format, defaultFormat)).toBe(expected);
    }
  );

  it('should return empty string if both format and default format are invalid', () => {
    expect(parseFormat('XYZ', 'ABC')).toBe('');
  });

  it('should remove disallowed characters', () => {
    expect(parseFormat('yyyy G', 'yyyy')).toBe('yyyy ');
  });
});
