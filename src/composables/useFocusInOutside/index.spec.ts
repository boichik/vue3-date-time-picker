import { describe, it, expect, vi } from 'vitest';
import { useFocusInOutside } from './index';
import { ref } from 'vue';

const { mockUseEventListenerOutside } = vi.hoisted(() => ({
  mockUseEventListenerOutside: vi.fn(),
}));

vi.mock('@/composables/useEventListenerOutside', () => ({
  useEventListenerOutside: mockUseEventListenerOutside,
}));

describe('useFocusInOutside', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call useEventListenerOutside with correct parameters for single target', () => {
    const target = ref(document.createElement('div'));
    const callback = vi.fn();

    useFocusInOutside(target, callback);

    expect(mockUseEventListenerOutside).toHaveBeenCalledWith(
      target,
      window,
      'focusin',
      callback
    );
  });

  it('should call useEventListenerOutside with correct parameters for array of targets', () => {
    const target1 = ref(document.createElement('div'));
    const target2 = ref(document.createElement('span'));
    const callback = vi.fn();

    useFocusInOutside([target1, target2], callback);

    expect(mockUseEventListenerOutside).toHaveBeenCalledWith(
      [target1, target2],
      window,
      'focusin',
      callback
    );
  });
});
