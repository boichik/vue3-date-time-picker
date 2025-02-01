import { mount } from '@vue/test-utils';
import AppButtonPanel from '@/ui/AppButtonPanel.vue';
import AppButton from '@/ui/AppButton.vue';

vi.mock('@/composables/useLocalization', () => ({
  useLocalization: vi.fn().mockReturnValue({
    t: (key: string) =>
      key === 'dp__cancel' || key === 'dp__apply' ? key : 'dp__apply',
  }),
}));

describe('AppButtonPanel.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders AppButton components', () => {
    const wrapper = mount(AppButtonPanel);

    const buttons = wrapper.findAllComponents(AppButton);
    expect(buttons).toHaveLength(2);

    expect(buttons[0].text()).toBe('Cancel');
    expect(buttons[1].text()).toBe('Apply');
  });

  it('rendering a component with custom texts when i18n is not initialized', () => {
    vi.doMock('@/composables/useLocalization', () => ({
      useLocalization: vi.fn().mockReturnValue(undefined),
    }));

    const wrapper = mount(AppButtonPanel, {
      props: {
        cancelText: 'Abort',
        applyText: 'Confirm',
      },
    });

    const buttons = wrapper.findAllComponents(AppButton);
    expect(buttons[0].text()).toBe('Abort');
    expect(buttons[1].text()).toBe('Confirm');
  });

  it('rendering a component with custom texts when i18n is initialized', () => {
    const wrapper = mount(AppButtonPanel, {
      props: {
        cancelText: 'Abort',
        applyText: 'Confirm',
      },
    });

    const buttons = wrapper.findAllComponents(AppButton);
    expect(buttons[0].text()).toBe('Abort');
    expect(buttons[1].text()).toBe('Confirm');
  });

  it('disables the submit button when "disabled" prop is true', () => {
    const wrapper = mount(AppButtonPanel, {
      props: { disabled: true },
    });

    const buttons = wrapper.findAllComponents(AppButton);
    expect(buttons[1].props('disabled')).toBe(true);
  });

  it('emits "cancel" event when the cancel button is clicked', async () => {
    const wrapper = mount(AppButtonPanel);

    const cancelButton = wrapper.findAllComponents(AppButton)[0];
    await cancelButton.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('cancel');
  });

  it('emits "submit" event when the submit button is clicked', async () => {
    const wrapper = mount(AppButtonPanel);

    const submitButton = wrapper.findAllComponents(AppButton)[1];
    await submitButton.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('apply');
  });

  it('does not emit "submit" when submit button is disabled', async () => {
    const wrapper = mount(AppButtonPanel, {
      props: { disabled: true },
    });

    const submitButton = wrapper.findAllComponents(AppButton)[1];
    await submitButton.trigger('click');

    expect(wrapper.emitted()).not.toHaveProperty('submit');
  });
});
