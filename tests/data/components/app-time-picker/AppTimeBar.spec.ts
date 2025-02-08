import { mount } from '@vue/test-utils';
import AppTimeBar from '@/components/app-time-picker/src/components/panel/AppTimeBar.vue';
import { initResizeObserverMock } from '@tests/mocks/ResizeObserverMock';
import AppTimeControlButton from '@/components/app-time-picker/src/components/base/AppTimeControlButton.vue';

const itemClass = '.app-time-picker-bar__column__item';

describe('AppTimeBar', () => {
  initResizeObserverMock();

  const createWrapper = (props = {}) => mount(AppTimeBar, { props });

  it('should render correctly', () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it('should correctly render a certain number of elements', async () => {
    const wrapper = createWrapper({ type: 'hours' });

    expect(wrapper.findAll(itemClass).length).toBe(24);

    await wrapper.setProps({ type: 'minutes' });
    expect(wrapper.findAll(itemClass).length).toBe(60);

    await wrapper.setProps({ type: 'seconds' });
    expect(wrapper.findAll(itemClass).length).toBe(60);

    await wrapper.setProps({ type: 'amPm' });
    expect(wrapper.findAll(itemClass).length).toBe(2);

    await wrapper.setProps({ type: 'hours', enabledAmPm: true });
    expect(wrapper.findAll(itemClass).length).toBe(12);
  });

  it('should display the correct time value when the AM PM mode is enabled', async () => {
    const wrapper = createWrapper({ type: 'hours', enabledAmPm: true });

    const items = wrapper.findAll(itemClass);

    expect(!!items.length).toBeTruthy();

    expect(items[0].text()).toBe('12');
    expect(items[1].text()).toBe('01');
    expect(items[11].text()).toBe('11');
  });

  it('the selected time should be displayed correctly', async () => {
    const wrapper = createWrapper({ modelValue: 2 });
    const items = wrapper.findAll(itemClass);
    expect(
      items[2].classes('app-time-picker-bar__column__item--selected')
    ).toBeTruthy();
  });

  it('should emits the selected number', async () => {
    const wrapper = createWrapper();

    const items = wrapper.findAll(itemClass);

    await items[2].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(2);
  });

  it('should correctly decrease the number when the previous button is pressed', async () => {
    const wrapper = createWrapper({ modelValue: 2 });

    const previousButton = wrapper.find('button');

    await previousButton.trigger('click');

    expect(
      wrapper.findComponent(AppTimeControlButton).emitted('click')
    ).toBeTruthy();
  });

  it('should not emit a value because the previous value button is locked', async () => {
    const wrapper = createWrapper({ modelValue: 0 });

    const previousButton = wrapper.find('button');

    await previousButton.trigger('click');

    expect(
      wrapper.findComponent(AppTimeControlButton).emitted('click')
    ).toBeFalsy();
  });

  it('should correctly increase the number when the next button is pressed', async () => {
    const wrapper = createWrapper({ modelValue: 2 });

    const nextButton = wrapper.findAll('button')[1];

    await nextButton.trigger('click');

    expect(
      wrapper.findAllComponents(AppTimeControlButton)[1].emitted('click')
    ).toBeTruthy();
  });

  it('should not emit a value because the next value button is locked', async () => {
    const wrapper = createWrapper({ modelValue: 23 });

    const nextButton = wrapper.findAll('button')[1];

    await nextButton.trigger('click');
    expect(
      wrapper.findAllComponents(AppTimeControlButton)[1].emitted('click')
    ).toBeFalsy();
  });

  it('should not emit a new value because the element is locked', async () => {
    const wrapper = createWrapper({
      disabledValue: (val: number) => {
        return val === 2;
      },
    });

    const items = wrapper.findAll(itemClass);

    expect(
      items[2].classes('app-time-picker-bar__column__item--disabled')
    ).toBeTruthy();
    await items[2].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
  });
});
