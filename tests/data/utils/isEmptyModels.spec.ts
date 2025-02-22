import { isEmptyModels } from '@/utils/isEmptyModels';

describe('Utils: isEmptyModels', () => {
  const testCase: any[] = [
    [false, true, false],
    [true, false, false],
    [1, 0, false],
    [1, undefined, false],
    [[], true, false],
    [undefined, undefined, true],
    [null, null, true],
    [null, undefined, true],
    [[null], [null], true],
    [[undefined], [undefined], true],
    [[undefined, undefined], [undefined, undefined], true],
  ];

  it.each(testCase)(
    'isEmptyModels: startModel = %i; endModel = i%; result = %i',
    (startModel, endModel, result) => {
      expect(isEmptyModels(startModel, endModel)).toBe(result);
    }
  );
});
