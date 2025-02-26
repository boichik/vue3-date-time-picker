import AppDateInput from '@/ui/AppDateInput.vue';
import { mount } from '@vue/test-utils';
import { format, parse } from 'date-fns';

describe('AppDateInput.vue', () => {
  const createWrapper = (props = {}) => mount(AppDateInput, { props });

  it('renders the input element', () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input.app-date-input');
    expect(input.exists()).toBe(true);
  });

  it('updates internal model when `modelValue` prop changes', async () => {
    const date = new Date(2025, 0, 1);
    const wrapper = createWrapper({ modelValue: date });

    expect(wrapper.find('input').element.value).toBe(
      format(date, 'yyyy/MM/dd')
    );

    const newDate = new Date(2025, 1, 1);
    await wrapper.setProps({ modelValue: newDate });
    expect(wrapper.find('input').element.value).toBe(
      format(newDate, 'yyyy/MM/dd')
    );
  });

  it('Update values when imask is not available', async () => {
    const wrapper = createWrapper();

    const newDate = new Date(2025, 1, 1);

    await wrapper.setProps({ modelValue: newDate });
    expect((wrapper.vm as any).model).toBe(format(newDate, 'yyyy/MM/dd'));
  });

  it('emits `focus` event when the input gains focus', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input');

    await input.trigger('focus');
    expect(wrapper.emitted('focus')).toHaveLength(1);
  });

  it('emits `blur` event when the input loses focus', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input');

    await input.trigger('blur');
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('emits `update:model-value` with a valid date when input value changes', async () => {
    const wrapper = createWrapper({
      format: 'yyyy/MM/dd',
      modelValue: null,
    });

    const input = wrapper.find('input');
    await input.setValue('2025/01/01');
    expect(wrapper.emitted('update:model-value')).toHaveLength(1);

    const emittedValue = wrapper.emitted('update:model-value')?.[0][0];
    expect(emittedValue).toEqual(parse('2025/01/01', 'yyyy/MM/dd', new Date()));
  });

  it('does not emit `update:model-value` for invalid date', async () => {
    const wrapper = createWrapper({
      format: 'yyyy/MM/dd',
      modelValue: null,
    });

    const input = wrapper.find('input');
    await input.setValue('2025/02/30'); // Invalid date
    expect(wrapper.emitted('update:model-value')).toBeUndefined();
  });

  it('handles focus and blur methods correctly', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input');

    vi.spyOn(input.element, 'focus');
    vi.spyOn(input.element, 'blur');

    (wrapper.vm as any).focus();
    expect(input.element.focus).toHaveBeenCalled();

    (wrapper.vm as any).blur();
    expect(input.element.blur).toHaveBeenCalled();
  });

  it('resets value on `remove` method call', async () => {
    const wrapper = createWrapper({
      format: 'yyyy/MM/dd',
      modelValue: new Date(2025, 0, 1),
    });

    (wrapper.vm as any).remove();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('input').element.value).toBe('');
  });

  it('destroys IMask instance on unmount', () => {
    const wrapper = createWrapper();
    const imaskInstance = (wrapper.vm as any).imaskInstance;
    expect(imaskInstance).not.toBeNull();

    wrapper.unmount();
    expect(imaskInstance.value).toBe('');
  });

  it('should be added to the id of the native input', () => {
    const id = 'customID';

    const wrapper = createWrapper({ customId: id });

    expect(wrapper.find('input').attributes('id')).toBe(id);
  });

  it('should be added to the name of the native input', () => {
    const name = 'custom';

    const wrapper = createWrapper({ customName: name });

    expect(wrapper.find('input').attributes('name')).toBe(name);
  });
});
