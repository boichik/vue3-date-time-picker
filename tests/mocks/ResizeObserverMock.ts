const { observe, disconnect, unobserve } = vi.hoisted(() => {
  return {
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  };
});

const instances: ResizeObserverMock[] = [];

class ResizeObserverMock {
  observe = observe;
  unobserve = unobserve;
  disconnect = disconnect;
  // eslint-disable-next-line no-undef
  constructor(public callback: ResizeObserverCallback) {
    instances.push(this);
  }
}

function initResizeObserverMock() {
  instances.length = 0;
  window.ResizeObserver = ResizeObserverMock;
}

/**
 * Function for manually calling the ResizeObserver callback.
 * @param entries - array of entries (can pass partial data)
 * @param index - instance index (default is the last created)
 */
function triggerResizeObserver(
  entries: Partial<ResizeObserverEntry>[] = [],
  index: number = instances.length - 1
) {
  const instance = instances[index];
  if (instance) {
    instance.callback(
      entries as ResizeObserverEntry[],
      instance as unknown as ResizeObserver
    );
  } else {
    console.warn('No ResizeObserver instance found to trigger.');
  }
}

export {
  instances,
  observe,
  disconnect,
  unobserve,
  initResizeObserverMock,
  triggerResizeObserver,
};
