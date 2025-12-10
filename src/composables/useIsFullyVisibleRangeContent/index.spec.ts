import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { shallowRef, type ShallowRef } from 'vue';
import { useIsFullyVisibleRangeContent } from './index';
import {
  initResizeObserverMock,
  observe,
} from '@tests/mocks/ResizeObserverMock';

// Mock Vue lifecycle hooks
const onMountedMock = vi.fn();
const onBeforeUnmountMock = vi.fn();

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    onMounted: (fn: () => void) => onMountedMock(fn),
    onBeforeUnmount: (fn: () => void) => onBeforeUnmountMock(fn),
  };
});

describe('useIsFullyVisibleRangeContent', () => {
  let elementRef: ShallowRef;
  let mockElement: Record<string, unknown>;

  beforeEach(() => {
    vi.clearAllMocks();
    initResizeObserverMock();

    mockElement = {
      offsetWidth: 100,
    };
    elementRef = shallowRef(mockElement);

    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('should initialize with isFullyVisible as false', () => {
    const { isFullyVisible } = useIsFullyVisibleRangeContent(elementRef);
    expect(isFullyVisible.value).toBe(false);
  });

  it('should calculate visibility correctly on mount', () => {
    // Setup window width
    // requiredWidth = 100 * 2 + 10 + 30 = 240
    window.innerWidth = 300; // 300 > 240 -> true

    const { isFullyVisible } = useIsFullyVisibleRangeContent(elementRef);

    // Trigger onMounted
    const mountedCallback = onMountedMock.mock.calls[0][0];
    mountedCallback();

    expect(isFullyVisible.value).toBe(true);
  });

  it('should set isFullyVisible to false if window is too narrow', () => {
    // requiredWidth = 100 * 2 + 10 + 30 = 240
    window.innerWidth = 200; // 200 < 240 -> false

    const { isFullyVisible } = useIsFullyVisibleRangeContent(elementRef);

    const mountedCallback = onMountedMock.mock.calls[0][0];
    mountedCallback();

    expect(isFullyVisible.value).toBe(false);
  });

  it('should handle element not being present', () => {
    elementRef.value = null;
    const { isFullyVisible } = useIsFullyVisibleRangeContent(elementRef);

    const mountedCallback = onMountedMock.mock.calls[0][0];
    mountedCallback();

    expect(isFullyVisible.value).toBe(false);
  });

  it('should handle element having 0 offsetWidth', () => {
    mockElement.offsetWidth = 0;
    const { isFullyVisible } = useIsFullyVisibleRangeContent(elementRef);

    const mountedCallback = onMountedMock.mock.calls[0][0];
    mountedCallback();

    expect(isFullyVisible.value).toBe(false);
  });

  it('should setup ResizeObserver on mount', () => {
    useIsFullyVisibleRangeContent(elementRef);

    const mountedCallback = onMountedMock.mock.calls[0][0];
    mountedCallback();

    expect(observe).toHaveBeenCalledWith(document.body);
  });
});
