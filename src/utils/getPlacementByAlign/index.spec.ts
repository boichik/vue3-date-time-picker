import { describe, it, expect } from 'vitest';
import { getPlacementByAlign } from './index';

describe('getPlacementByAlign', () => {
  it.each([
    ['center', 'bottom'],
    ['right', 'bottom-end'],
    ['left', 'bottom-start'],
  ])('should return correct placement for align "%s"', (align, expected) => {
    expect(getPlacementByAlign(align)).toBe(expected);
  });

  it.each([[undefined], [null], [''], ['top'], ['random-string'], [123], [{}]])(
    'should return default "bottom-start" for invalid align: %s',
    align => {
      expect(getPlacementByAlign(align)).toBe('bottom-start');
    }
  );
});
