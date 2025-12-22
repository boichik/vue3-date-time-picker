import { describe, it, expect, vi } from 'vitest';
import { useClickOutside } from './index';
import { ref } from 'vue';

const { mockUseEventListenerOutside } = vi.hoisted(() => ({
  mockUseEventListenerOutside: vi.fn(),
}));

vi.mock('@/composables/useEventListenerOutside', () => ({
  useEventListenerOutside: mockUseEventListenerOutside,
}));

describe('useClickOutside', () => {
  it('should call useEventListenerOutside with correct parameters for single target', () => {
    const target = ref(document.createElement('div'));
    const callback = vi.fn();

    useClickOutside(target, callback);

    expect(mockUseEventListenerOutside).toHaveBeenCalledWith(
      target,
      document,
      'click',
      callback
    );
  });

  it('should call useEventListenerOutside with correct parameters for array of targets', () => {
    const target1 = ref(document.createElement('div'));
    const target2 = ref(document.createElement('span'));
    const callback = vi.fn();

    useClickOutside([target1, target2], callback);

    expect(mockUseEventListenerOutside).toHaveBeenCalledWith(
      [target1, target2],
      document,
      'click',
      callback
    );
  });
});
