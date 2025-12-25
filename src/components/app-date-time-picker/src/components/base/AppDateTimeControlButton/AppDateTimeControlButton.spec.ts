import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, afterAll, vi, beforeEach } from 'vitest';
import AppDateTimeControlButton from './AppDateTimeControlButton.vue';
import ChevronLeftIcon from '@heroicons/vue/16/solid/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/vue/16/solid/ChevronRightIcon';
import ChevronDoubleLeftIcon from '@heroicons/vue/16/solid/ChevronDoubleLeftIcon';
import ChevronDoubleRightIcon from '@heroicons/vue/16/solid/ChevronDoubleRightIcon';

const createWrapper = (
  props: Partial<InstanceType<typeof AppDateTimeControlButton>['$props']> = {}
) => {
  return shallowMount(AppDateTimeControlButton, {
    props,
  });
};

describe('AppDateTimeControlButton', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    [undefined, ChevronLeftIcon],
    [{ isRightPosition: true }, ChevronRightIcon],
    [{ doubleArrow: true }, ChevronDoubleLeftIcon],
    [{ doubleArrow: true, isRightPosition: true }, ChevronDoubleRightIcon],
  ])(
    'should render correct icon based on props: %o',
    async (props, expectedIcon) => {
      const wrapper = createWrapper(props);

      const iconComponent = wrapper.findComponent(expectedIcon);
      expect(iconComponent.exists()).toBe(true);
    }
  );

  it('should pass the disabled attribute to the button element', () => {
    const wrapper = createWrapper({ disabled: true });
    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('should emit click event when button is clicked and disabled prop is false', async () => {
    const wrapper = createWrapper({ disabled: false });
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('should not emit click event when button is clicked and disabled prop is true', async () => {
    const wrapper = createWrapper({ disabled: true });
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  });

  it('should update the rendered icon component when props change', async () => {
    const wrapper = createWrapper({ doubleArrow: false });

    expect(wrapper.findComponent(ChevronLeftIcon).exists()).toBe(true);

    await wrapper.setProps({ doubleArrow: true });
    expect(wrapper.findComponent(ChevronDoubleLeftIcon).exists()).toBe(true);
  });
});
