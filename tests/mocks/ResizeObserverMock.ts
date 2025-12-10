const { observe, disconnect, unobserve } = vi.hoisted(() => {
  return {
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  };
});

class ResizeObserverMock {
  observe = observe;
  unobserve = unobserve;
  disconnect = disconnect;
  // eslint-disable-next-line no-undef
  constructor(public callback: ResizeObserverCallback) {}
}

function initResizeObserverMock() {
  window.ResizeObserver = ResizeObserverMock;
}

export { observe, disconnect, unobserve, initResizeObserverMock };
