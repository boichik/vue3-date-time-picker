import { mount } from '@vue/test-utils';
import AppTimeControlButton from './AppTimeControlButton.vue';
import ChevronUpIcon from '@heroicons/vue/16/solid/ChevronUpIcon';
import ChevronDownIcon from '@heroicons/vue/16/solid/ChevronDownIcon';

describe('AppTimeControlButton', () => {
  const createWrapper = (props = {}) => {
    return mount(AppTimeControlButton, {
      props: {
        disabled: false,
        isUpType: false,
        ...props,
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render button element', () => {
      const wrapper = createWrapper();
      const button = wrapper.find('button');

      expect(button.exists()).toBe(true);
    });

    it('should render ChevronDownIcon by default', () => {
      const wrapper = createWrapper();
      const icon = wrapper.findComponent(ChevronDownIcon);

      expect(icon.exists()).toBe(true);
    });

    it('should render ChevronUpIcon when isUpType is true', () => {
      const wrapper = createWrapper({ isUpType: true });
      const icon = wrapper.findComponent(ChevronUpIcon);

      expect(icon.exists()).toBe(true);
    });

    it('should render ChevronDownIcon when isUpType is undefined', () => {
      const wrapper = createWrapper({ isUpType: undefined });
      const icon = wrapper.findComponent(ChevronDownIcon);

      expect(icon.exists()).toBe(true);
    });
  });

  describe('Button Attributes', () => {
    it('should have tabindex -1', () => {
      const wrapper = createWrapper();
      const button = wrapper.find('button');

      expect(button.attributes('tabindex')).toBe('-1');
    });

    it('should not be disabled by default', () => {
      const wrapper = createWrapper();
      const button = wrapper.find('button');

      expect(button.attributes('disabled')).toBeUndefined();
    });

    it('should be disabled when disabled prop is true', () => {
      const wrapper = createWrapper({ disabled: true });
      const button = wrapper.find('button');

      expect(button.attributes('disabled')).toBeDefined();
    });

    it('should not be disabled when disabled prop is false', () => {
      const wrapper = createWrapper({ disabled: false });
      const button = wrapper.find('button');

      expect(button.attributes('disabled')).toBeUndefined();
    });

    it('should not be disabled when disabled prop is undefined', () => {
      const wrapper = createWrapper({ disabled: undefined });
      const button = wrapper.find('button');

      expect(button.attributes('disabled')).toBeUndefined();
    });
  });

  describe('Combined Props Changes', () => {
    it('should handle disabled and isUpType props changes together', async () => {
      const wrapper = createWrapper({ disabled: false, isUpType: false });
      const button = wrapper.find('button');

      expect(button.attributes('disabled')).toBeUndefined();
      expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(true);

      await wrapper.setProps({ disabled: true, isUpType: true });

      expect(button.attributes('disabled')).toBeDefined();
      expect(wrapper.findComponent(ChevronUpIcon).exists()).toBe(true);
    });

    it('should emit click for enabled up button', async () => {
      const wrapper = createWrapper({ disabled: false, isUpType: true });
      const button = wrapper.find('button');

      await button.trigger('click');

      expect(wrapper.emitted('click')).toBeTruthy();
    });

    it('should not emit click for disabled up button', async () => {
      const wrapper = createWrapper({ disabled: true, isUpType: true });
      const button = wrapper.find('button');

      await button.trigger('click');

      expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('should emit click for enabled down button', async () => {
      const wrapper = createWrapper({ disabled: false, isUpType: false });
      const button = wrapper.find('button');

      await button.trigger('click');

      expect(wrapper.emitted('click')).toBeTruthy();
    });

    it('should not emit click for disabled down button', async () => {
      const wrapper = createWrapper({ disabled: true, isUpType: false });
      const button = wrapper.find('button');

      await button.trigger('click');

      expect(wrapper.emitted('click')).toBeFalsy();
    });
  });
});
