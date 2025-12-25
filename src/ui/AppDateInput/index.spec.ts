import { shallowMount } from '@vue/test-utils';
import AppDateInput from './Index.vue';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const { IMaskMock, imaskInstanceMock } = vi.hoisted(() => {
  const instance = {
    on: vi.fn(),
    destroy: vi.fn(),
    masked: {
      value: '',
      reset: vi.fn(),
    },
    value: '',
  };
  return {
    IMaskMock: vi.fn(() => instance),
    imaskInstanceMock: instance,
  };
});

vi.mock('vue-imask', () => ({
  IMask: IMaskMock,
}));

describe('AppDateInput', () => {
  const createWrapper = (
    props?: Partial<InstanceType<typeof AppDateInput>['$props']>
  ) => {
    return shallowMount(AppDateInput, {
      props,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();

    imaskInstanceMock.masked.value = '';
    imaskInstanceMock.value = '';
  });

  it('should render input element with correct attributes', () => {
    const wrapper = createWrapper({
      placeholder: 'Test Placeholder',
      customId: 'test-id',
      customName: 'test-name',
      disabled: true,
      readonly: true,
    });

    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.attributes('id')).toBe('test-id');
    expect(input.attributes('name')).toBe('test-name');
    expect(input.attributes('placeholder')).toBe('Test Placeholder');
    expect(input.element.disabled).toBe(true);
    expect(input.element.readOnly).toBe(true);
  });

  it('should initialize IMask on mount', () => {
    createWrapper();
    expect(IMaskMock).toHaveBeenCalled();
  });

  it('should destroy IMask on unmount', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
    expect(imaskInstanceMock.destroy).toHaveBeenCalled();
  });

  it('should format initial modelValue correctly', () => {
    const date = new Date(2023, 0, 15);
    const wrapper = createWrapper({
      modelValue: date,
      format: 'yyyy/MM/dd',
    });

    const input = wrapper.find('input');
    expect(input.element.value).toBe('2023/01/15');
  });

  it('should update input value when modelValue prop changes', async () => {
    const wrapper = createWrapper({
      modelValue: null,
      format: 'yyyy/MM/dd',
    });

    const input = wrapper.find('input');
    expect(input.element.value).toBe('');

    await wrapper.setProps({ modelValue: new Date(2023, 11, 31) });
    expect(input.element.value).toBe('2023/12/31');
    expect(imaskInstanceMock.masked.value).toBe('2023/12/31');
  });

  it('should emit update:model-value when user types a valid date', async () => {
    const wrapper = createWrapper({ format: 'yyyy/MM/dd' });

    const acceptCallback = imaskInstanceMock.on.mock.calls.find(
      call => call[0] === 'accept'
    )?.[1];

    expect(acceptCallback).toBeDefined();

    imaskInstanceMock.value = '2023/05/20';
    acceptCallback();

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    const emittedDate = wrapper.emitted('update:model-value')?.[0][0] as Date;
    expect(emittedDate.getFullYear()).toBe(2023);
    expect(emittedDate.getMonth()).toBe(4);
    expect(emittedDate.getDate()).toBe(20);
  });

  it('should NOT emit update:model-value when date is incomplete', async () => {
    const wrapper = createWrapper({ format: 'yyyy/MM/dd' });

    const acceptCallback = imaskInstanceMock.on.mock.calls.find(
      call => call[0] === 'accept'
    )?.[1];

    imaskInstanceMock.value = '2023/05/';
    acceptCallback();

    expect(wrapper.emitted('update:model-value')).toBeFalsy();
  });

  it('should NOT emit update:model-value when date is invalid (e.g. day 32)', async () => {
    const wrapper = createWrapper({ format: 'yyyy/MM/dd' });

    const acceptCallback = imaskInstanceMock.on.mock.calls.find(
      call => call[0] === 'accept'
    )?.[1];

    imaskInstanceMock.value = '2023/01/32';
    acceptCallback();

    expect(wrapper.emitted('update:model-value')).toBeFalsy();
  });

  it('should NOT emit update:model-value if date is disabled via prop', async () => {
    const disabledDate = new Date(2023, 0, 1);
    const wrapper = createWrapper({
      format: 'yyyy/MM/dd',
      disabledDate: date => date.getTime() === disabledDate.getTime(),
    });

    const acceptCallback = imaskInstanceMock.on.mock.calls.find(
      call => call[0] === 'accept'
    )?.[1];

    imaskInstanceMock.value = '2023/01/01';
    acceptCallback();

    expect(wrapper.emitted('update:model-value')).toBeFalsy();
  });

  it('should emit null when input is cleared', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(),
    });

    const acceptCallback = imaskInstanceMock.on.mock.calls.find(
      call => call[0] === 'accept'
    )?.[1];

    imaskInstanceMock.value = '';
    acceptCallback();

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')?.[0][0]).toBeNull();
  });

  it('should not reset input on blur if value is invalid', async () => {
    const initialDate = new Date(2023, 0, 1);
    const wrapper = createWrapper({
      modelValue: initialDate,
      format: 'yyyy/MM/dd',
    });

    const input = wrapper.find('input');

    input.element.value = 'invalid-date';
    await input.trigger('input');

    await input.trigger('blur');

    expect(imaskInstanceMock.masked.reset).not.toHaveBeenCalled();
    expect(input.element.value).toBe('2023/01/01');
  });

  it('should emit focus and blur events', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input');

    await input.trigger('focus');
    expect(wrapper.emitted('focus')).toBeTruthy();

    await input.trigger('blur');
    expect(wrapper.emitted('blur')).toBeTruthy();
    expect(imaskInstanceMock.masked.reset).toHaveBeenCalled();
  });

  it('should expose focus, blur, and remove methods', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input');

    input.element.focus = vi.fn();
    input.element.blur = vi.fn();

    wrapper.vm.focus();
    expect(input.element.focus).toHaveBeenCalled();

    wrapper.vm.blur();
    expect(input.element.blur).toHaveBeenCalled();

    wrapper.vm.remove();
    expect(input.element.value).toBe('');
  });
});
