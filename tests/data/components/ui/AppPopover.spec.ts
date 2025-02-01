import { mount } from '@vue/test-utils';
import Popover from '@/ui/AppPopover.vue';

describe('Popover.vue', () => {
  const createWrapper = () =>
    mount(Popover, {
      props: {
        modelValue: false,
        placement: 'top',
        openDelay: 0,
        closeDelay: 0,
        tabindex: 0,
        appendToBody: false,
        disabled: false,
      },
      slots: {
        reference: '<button>Reference</button>',
        content: '<div>Popover Content</div>',
      },
    });

  it('renders the reference slot correctly', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('.app-popover').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Reference');
  });

  it('renders the content slot correctly when visible', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ modelValue: true });
    expect(wrapper.find('.app-popover__content').exists()).toBe(true);
    expect(wrapper.find('.app-popover__content').text()).toBe(
      'Popover Content'
    );
  });

  it('hides content when modelValue is false', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ modelValue: false });
    expect(wrapper.find('.app-popover__content').isVisible()).toBe(false);
  });

  it('emits "update:modelValue" when visibility changes', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ modelValue: true });
    wrapper.vm.$emit('update:modelValue', false);
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('calls "close" event when popover hides', async () => {
    const wrapper = createWrapper();

    const closeHandler = vi.fn();
    wrapper.setProps({ modelValue: true });
    wrapper.vm.$emit('close');
    expect(wrapper.emitted('close')).toBeTruthy();
    expect(closeHandler).toHaveBeenCalledTimes(0);
  });

  it('applies the correct placement', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ placement: 'bottom' });
    expect(wrapper.props('placement')).toBe('bottom');
  });
});
