import { describe, it, expect } from 'vitest';
import { enabledDateTimeTypeByTemplate } from './index';

describe('enabledDateTimeTypeByTemplate', () => {
  it('should return all false values for an empty string', () => {
    const result = enabledDateTimeTypeByTemplate('');
    expect(result).toEqual({
      years: false,
      months: false,
      days: false,
      hours: false,
      minutes: false,
      seconds: false,
      amPm: false,
    });
  });

  it('should detect years for both "Y" and "y"', () => {
    expect(enabledDateTimeTypeByTemplate('YYYY').years).toBe(true);
    expect(enabledDateTimeTypeByTemplate('yyyy').years).toBe(true);
    expect(enabledDateTimeTypeByTemplate('MM-DD').years).toBe(false);
  });

  it('should detect months only for uppercase "M"', () => {
    expect(enabledDateTimeTypeByTemplate('MM').months).toBe(true);
    expect(enabledDateTimeTypeByTemplate('mm').months).toBe(false);
  });

  it('should detect days for both "D" and "d"', () => {
    expect(enabledDateTimeTypeByTemplate('DD').days).toBe(true);
    expect(enabledDateTimeTypeByTemplate('dd').days).toBe(true);
    expect(enabledDateTimeTypeByTemplate('YYYY-MM').days).toBe(false);
  });

  it('should detect hours for both "HH" and "hh"', () => {
    expect(enabledDateTimeTypeByTemplate('HH').hours).toBe(true);
    expect(enabledDateTimeTypeByTemplate('hh').hours).toBe(true);
    expect(enabledDateTimeTypeByTemplate('mm:ss').hours).toBe(false);
  });

  it('should detect minutes only for lowercase "mm"', () => {
    expect(enabledDateTimeTypeByTemplate('mm').minutes).toBe(true);
    expect(enabledDateTimeTypeByTemplate('MM').minutes).toBe(false);
  });

  it('should detect seconds only for lowercase "ss"', () => {
    expect(enabledDateTimeTypeByTemplate('ss').seconds).toBe(true);
    expect(enabledDateTimeTypeByTemplate('SS').seconds).toBe(false);
  });

  it('should detect amPm only for lowercase "a"', () => {
    expect(enabledDateTimeTypeByTemplate('a').amPm).toBe(true);
    expect(enabledDateTimeTypeByTemplate('A').amPm).toBe(false);
  });

  it('should return all true for a complete template', () => {
    const result = enabledDateTimeTypeByTemplate('YYYY-MM-DD HH:mm:ss a');
    expect(result).toEqual({
      years: true,
      months: true,
      days: true,
      hours: true,
      minutes: true,
      seconds: true,
      amPm: true,
    });
  });

  it('should handle non-string inputs gracefully', () => {
    // @ts-expect-error - testing non-string input
    const result = enabledDateTimeTypeByTemplate(null);
    expect(result).toEqual({
      years: false,
      months: false,
      days: false,
      hours: false,
      minutes: false,
      seconds: false,
      amPm: false,
    });
  });
});
