import { getPlacementByAlign } from '@/utils/getPlacementByAlign';

describe('Utils: getPlacementByAlign', () => {
  const defaultValue = 'bottom-start';

  const testCase: any[] = [
    [true, defaultValue],
    [false, defaultValue],
    [null, defaultValue],
    [undefined, defaultValue],
    [NaN, defaultValue],
    [1, defaultValue],
    [0, defaultValue],
    [[], defaultValue],
    [{}, defaultValue],
    ['ab', defaultValue],
    ['left', 'bottom-start'],
    ['center', 'bottom'],
    ['right', 'bottom-end'],
  ];

  it.each(testCase)(
    'getPlacementByAlign: align = %i; result = %i',
    (align, result) => {
      expect(getPlacementByAlign(align)).toBe(result);
    }
  );
});
