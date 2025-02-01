const observeFn = vi.fn();
const disconnectFn = vi.fn();

class ResizeObserver {
  observe() {
    return observeFn;
  }
  disconnect() {
    return disconnectFn;
  }
}

function initResizeObserverMock() {
  window.ResizeObserver = ResizeObserver;
}

export { observeFn, disconnectFn, initResizeObserverMock };
