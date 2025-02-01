import { mount } from '@vue/test-utils';
import AppButton from '@/ui/AppButton.vue';

describe('AppButton.vue', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(AppButton);
    const button = wrapper.find('button');

    expect(button.exists()).toBe(true);
    expect(button.classes()).toContain('app-button--default');
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('renders with type="submit"', () => {
    const wrapper = mount(AppButton, {
      props: { type: 'submit' },
    });

    const button = wrapper.find('button');
    expect(button.classes()).toContain('app-button--submit');
    expect(button.classes()).not.toContain('app-button--default');
  });

  it('renders with type="default"', () => {
    const wrapper = mount(AppButton, {
      props: { type: 'default' },
    });

    const button = wrapper.find('button');
    expect(button.classes()).not.toContain('app-button--submit');
    expect(button.classes()).toContain('app-button--default');
  });

  it('renders with incorrect type', () => {
    const wrapper = mount(AppButton, {
      props: { type: 'true' } as any,
    });

    const button = wrapper.find('button');
    expect(button.classes()).not.toContain('app-button--submit');
    expect(button.classes()).not.toContain('app-button--default');
  });

  it('rendering a component with prop “disabled” with a value of “false”', () => {
    const wrapper = mount(AppButton, {
      props: { disabled: false },
    });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).not.toBeDefined();
  });

  it('renders as disabled when prop is set', () => {
    const wrapper = mount(AppButton, {
      props: { disabled: true },
    });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeDefined();
    expect(button.attributes('disabled')).toBe('');
  });

  it('renders as disabled when prop is inccorect', () => {
    const wrapper = mount(AppButton, {
      props: { disabled: 'true' } as any,
    });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).not.toBeDefined();
  });

  it('emits "click" event when clicked and not disabled', async () => {
    const wrapper = mount(AppButton);
    const button = wrapper.find('button');

    await button.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('does not emit "click" event when clicked and disabled', async () => {
    const wrapper = mount(AppButton, {
      props: { disabled: true },
    });

    const button = wrapper.find('button');
    await button.trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('click');
  });

  it('renders slot content correctly', () => {
    const slotContent = 'Click Me';
    const wrapper = mount(AppButton, {
      slots: { default: slotContent },
    });

    const button = wrapper.find('button');
    expect(button.text()).toBe(slotContent);
  });
});
