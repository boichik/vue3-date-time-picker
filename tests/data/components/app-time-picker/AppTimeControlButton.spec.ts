import { mount } from '@vue/test-utils';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/16/solid';
import AppTimeControlButton from '@/components/app-time-picker/src/components/base/AppTimeControlButton.vue';

const testCase: any[] = [
  [{ isUpType: true }, ChevronUpIcon],
  [{ isUpType: false }, ChevronDownIcon],
  [{ isUpType: undefined }, ChevronDownIcon],
];

const defaultProps = {
  disabled: false,
  isUpType: false,
};

describe('AppTimeControlButton', () => {
  const createWrapper = (props = {}) => mount(AppTimeControlButton, { props });

  it.each(testCase)(
    'renders the correct icon based on props - %p',
    async (props, component) => {
      const wrapper = createWrapper(props);

      expect(wrapper.props()).toEqual({
        ...defaultProps,
        ...props,
      });

      expect(wrapper.findComponent(component).exists()).toBeTruthy();
    }
  );

  it('emits "click" event when clicked and not disabled', async () => {
    const wrapper = createWrapper({ disabled: false });
    const button = wrapper.find('button');

    expect(button.attributes('disabled')).toBeUndefined();
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('does not emit "click" event when clicked and disabled', async () => {
    const wrapper = createWrapper({ disabled: true });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBe('');
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  });
});
