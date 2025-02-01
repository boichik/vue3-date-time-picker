import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/vue/16/solid';
import AppDateTimeControlButton from '@/components/app-date-time-picker/src/components/base/AppDateTimeControlButton.vue';
import { mount } from '@vue/test-utils';

const testCase: any[] = [
  [{ isRightPosition: '123' }, ChevronRightIcon],
  [{ isRightPosition: 'true' }, ChevronRightIcon],
  [{ isRightPosition: 1 }, ChevronRightIcon],
  [{ isRightPosition: false }, ChevronLeftIcon],
  [{ isRightPosition: true }, ChevronRightIcon],
  [{ doubleArrow: true }, ChevronDoubleLeftIcon],
  [{ doubleArrow: true, isRightPosition: true }, ChevronDoubleRightIcon],
];

const defaultProps = {
  disabled: false,
  doubleArrow: false,
  isRightPosition: false,
};

describe('AppDateTimeControlButton', () => {
  it.each(testCase)(
    'renders the correct icon based on props - %p',
    async (props, component) => {
      const wrapper = mount(AppDateTimeControlButton, { props });

      expect(wrapper.props()).toEqual({
        ...defaultProps,
        ...props,
      });
      expect(wrapper.vm.iconComponent).toBe(component);

      expect(wrapper.findComponent(component).exists()).toBeTruthy();
    }
  );

  it('emits "click" event when clicked and not disabled', async () => {
    const wrapper = mount(AppDateTimeControlButton, {
      props: { disabled: false },
    });
    const button = wrapper.find('button');

    expect(button.attributes('disabled')).toBeUndefined();
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('does not emit "click" event when clicked and disabled', async () => {
    const wrapper = mount(AppDateTimeControlButton, {
      props: { disabled: true },
    });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBe('');
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  });
});
