/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, ref, h } from 'vue';
import { useEventListenerOutside } from './index';
import type { EventListenerOutsideTarget } from './types';

describe('useEventListenerOutside', () => {
  let divElement: HTMLDivElement;
  let outsideElement: HTMLDivElement;
  let wrapper: VueWrapper | null = null;

  beforeEach(() => {
    divElement = document.createElement('div');
    divElement.setAttribute('data-testid', 'inside-target');
    divElement.textContent = 'Inside';

    outsideElement = document.createElement('div');
    outsideElement.setAttribute('data-testid', 'outside-target');
    outsideElement.textContent = 'Outside';

    document.body.appendChild(divElement);
    document.body.appendChild(outsideElement);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should trigger callback when clicking outside the target', async () => {
    const callback = vi.fn();

    const TestComponent = defineComponent({
      setup() {
        const target = ref(divElement);
        useEventListenerOutside(target, document, 'click', callback);
        return () => h('div');
      },
    });

    wrapper = mount(TestComponent, { attachTo: document.body });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    Object.defineProperty(clickEvent, 'target', {
      value: outsideElement,
      writable: false,
    });

    outsideElement.dispatchEvent(clickEvent);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(true, expect.any(MouseEvent));
  });

  it('should not trigger callback when clicking inside the target', async () => {
    const callback = vi.fn();

    const TestComponent = defineComponent({
      setup() {
        const target = ref(divElement);
        useEventListenerOutside(target, document, 'click', callback);
        return () => h('div');
      },
    });

    wrapper = mount(TestComponent, { attachTo: document.body });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    Object.defineProperty(clickEvent, 'target', {
      value: divElement,
      writable: false,
    });

    divElement.dispatchEvent(clickEvent);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle array of targets and not trigger if clicked inside one of them', async () => {
    const callback = vi.fn();
    const secondTarget = document.createElement('span');
    secondTarget.textContent = 'Second target';
    divElement.appendChild(secondTarget);

    const TestComponent = defineComponent({
      setup() {
        const t1 = ref(divElement);
        const t2 = ref(secondTarget);
        useEventListenerOutside([t1, t2], document, 'click', callback);
        return () => h('div');
      },
    });

    wrapper = mount(TestComponent, { attachTo: document.body });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true,
    });

    Object.defineProperty(clickEvent, 'target', {
      value: secondTarget,
      writable: false,
    });

    secondTarget.dispatchEvent(clickEvent);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should trigger callback when clicking outside all targets in an array', async () => {
    const callback = vi.fn();
    const secondTarget = document.createElement('div');
    secondTarget.textContent = 'Second';
    document.body.appendChild(secondTarget);

    const TestComponent = defineComponent({
      setup() {
        const t1 = ref(divElement);
        const t2 = ref(secondTarget);
        useEventListenerOutside([t1, t2], document, 'click', callback);
        return () => h('div');
      },
    });

    wrapper = mount(TestComponent, { attachTo: document.body });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true,
    });

    Object.defineProperty(clickEvent, 'target', {
      value: outsideElement,
      writable: false,
    });

    outsideElement.dispatchEvent(clickEvent);

    expect(callback).toHaveBeenCalledWith(true, expect.any(MouseEvent));
  });

  it('should support Vue component refs with $el', async () => {
    const callback = vi.fn();
    const mockComponentRef = ref({ $el: divElement });

    const TestComponent = defineComponent({
      setup() {
        useEventListenerOutside(
          mockComponentRef as unknown as EventListenerOutsideTarget,
          document,
          'click',
          callback
        );
        return () => h('div');
      },
    });

    wrapper = mount(TestComponent, { attachTo: document.body });

    let clickEvent = new MouseEvent('click', { bubbles: true, composed: true });
    Object.defineProperty(clickEvent, 'target', {
      value: divElement,
      writable: false,
    });
    divElement.dispatchEvent(clickEvent);
    expect(callback).not.toHaveBeenCalled();

    clickEvent = new MouseEvent('click', { bubbles: true, composed: true });
    Object.defineProperty(clickEvent, 'target', {
      value: outsideElement,
      writable: false,
    });
    outsideElement.dispatchEvent(clickEvent);
    expect(callback).toHaveBeenCalled();
  });

  it('should handle FocusEvent and check relatedTarget', async () => {
    const callback = vi.fn();
    const inputInside = document.createElement('input');
    divElement.appendChild(inputInside);

    const inputOutside = document.createElement('input');
    document.body.appendChild(inputOutside);

    const TestComponent = defineComponent({
      setup() {
        const target = ref(divElement);
        useEventListenerOutside(target, document, 'focusin', callback);
        return () => h('div');
      },
    });

    wrapper = mount(TestComponent, { attachTo: document.body });

    const focusEventInside = new FocusEvent('focusin', {
      bubbles: true,
      composed: true,
      relatedTarget: inputInside,
    });
    Object.defineProperty(focusEventInside, 'target', {
      value: inputInside,
      writable: false,
    });
    inputInside.dispatchEvent(focusEventInside);
    expect(callback).not.toHaveBeenCalled();

    const focusEventOutside = new FocusEvent('focusin', {
      bubbles: true,
      composed: true,
      relatedTarget: inputOutside,
    });
    Object.defineProperty(focusEventOutside, 'target', {
      value: inputOutside,
      writable: false,
    });
    inputOutside.dispatchEvent(focusEventOutside);
    expect(callback).toHaveBeenCalledWith(true, expect.any(FocusEvent));
  });

  it('should remove event listener on unmount', async () => {
    const callback = vi.fn();
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const TestComponent = defineComponent({
      setup() {
        const target = ref(divElement);
        useEventListenerOutside(target, document, 'click', callback);
        return () => h('div');
      },
    });

    wrapper = mount(TestComponent, { attachTo: document.body });

    wrapper.unmount();
    wrapper = null;

    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function));

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true,
    });
    Object.defineProperty(clickEvent, 'target', {
      value: outsideElement,
      writable: false,
    });
    outsideElement.dispatchEvent(clickEvent);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should return early if target ref is null', async () => {
    const callback = vi.fn();
    const nullRef = ref(null);

    const TestComponent = defineComponent({
      setup() {
        useEventListenerOutside(nullRef, document, 'click', callback);
        return () => h('div');
      },
    });

    wrapper = mount(TestComponent, { attachTo: document.body });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true,
    });
    Object.defineProperty(clickEvent, 'target', {
      value: outsideElement,
      writable: false,
    });
    outsideElement.dispatchEvent(clickEvent);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should return early if target array is empty', async () => {
    const callback = vi.fn();

    const TestComponent = defineComponent({
      setup() {
        useEventListenerOutside([], document, 'click', callback);
        return () => h('div');
      },
    });

    wrapper = mount(TestComponent, { attachTo: document.body });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true,
    });
    Object.defineProperty(clickEvent, 'target', {
      value: outsideElement,
      writable: false,
    });
    outsideElement.dispatchEvent(clickEvent);

    expect(callback).not.toHaveBeenCalled();
  });
});
