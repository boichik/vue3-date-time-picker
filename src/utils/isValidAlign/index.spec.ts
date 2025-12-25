import { describe, it, expect } from 'vitest';
import { isValidAlign } from './index';

describe('isValidAlign', () => {
  it.each(['left', 'center', 'right'])(
    'should return true for valid align value: %s',
    align => {
      expect(isValidAlign(align)).toBe(true);
    }
  );

  it.each([
    'top',
    'bottom',
    '',
    ' random ',
    null,
    undefined,
    123,
    true,
    {},
    [],
    () => {},
  ])('should return false for invalid align value: %s', align => {
    expect(isValidAlign(align)).toBe(false);
  });
});
