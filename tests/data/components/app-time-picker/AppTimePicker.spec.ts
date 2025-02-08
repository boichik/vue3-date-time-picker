import type { AppTimePickerProps } from '@/components/app-time-picker';
import AppTimePicker from '@/components/app-time-picker/src/AppTimePicker.vue';
import { mount, VueWrapper } from '@vue/test-utils';
import AppPopover from '@/ui/AppPopover.vue';
import AppTimeDefaultMode from '@/components/app-time-picker/src/components/mode/AppTimeDefaultMode.vue';
import AppTimeRangeMode from '@/components/app-time-picker/src/components/mode/AppTimeRangeMode.vue';
import AppButton from '@/ui/AppButton.vue';
import AppButtonPanel from '@/ui/AppButtonPanel.vue';
import AppTimeBar from '@/components/app-time-picker/src/components/panel/AppTimeBar.vue';
import AppTimeContent from '@/components/app-time-picker/src/components/base/AppTimeContent.vue';
import { initResizeObserverMock } from '@tests/mocks/ResizeObserverMock';
import { fakeTimeWrapper } from '@tests/mocks/utils';

vi.mock('@/composables/useLocalization', () => ({
  useLocalization: vi.fn(),
}));

const openPopover = async (wrapper: VueWrapper) => {
  const input = wrapper.find<HTMLInputElement>('.app-time-picker-input__inner');

  await input.trigger('focus');

  const popover = wrapper.findComponent(AppPopover);

  await vi.waitUntil(() => popover.emitted('open'), {
    timeout: 200,
    interval: 2,
  });

  return { popover, input };
};

const applyValue = async (wrapper: VueWrapper) => {
  const panel = wrapper.findComponent(AppButtonPanel);

  const buttons = panel.findAll('button');

  expect(buttons[1].exists()).toBeTruthy();

  await buttons[1].trigger('click');
};

const selectElementInBar = async (el: VueWrapper, index: number) => {
  const li = el.findAll('li');

  expect(li[index].exists()).toBeTruthy();

  await li[index].trigger('click');
};

describe('AppTimePicker', () => {
  initResizeObserverMock();

  const mockErrorHandler = vi.fn();
  const mockDate = new Date(2025, 0, 1);

  vi.useFakeTimers().setSystemTime(mockDate);

  const createWrapper = (props: AppTimePickerProps = {}, slots = {}) => {
    return mount(AppTimePicker, {
      props,
      slots,
      global: {
        config: {
          errorHandler: mockErrorHandler,
        },
      },
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be rendered with an input', () => {
    const wrapper = createWrapper();

    const input = wrapper.find('.app-time-picker-input');

    expect(input.isVisible()).toBeTruthy();
  });

  it('should be rendered in readonly mode', () => {
    const wrapper = createWrapper({ readonly: true });

    const input = wrapper.find('.app-time-picker-input--read-only');

    expect(input.isVisible()).toBeTruthy();
  });

  it('should use the default value readonly', () => {
    const wrapper = createWrapper({ readonly: 'true' });

    const input = wrapper.find('.app-time-picker-input__inner');

    expect(input.attributes('readonly')).toBeFalsy();
  });

  it('should be rendered in disabled mode', () => {
    const wrapper = createWrapper({ disabled: true });

    const input = wrapper.find('.app-time-picker-input--disabled');

    expect(input.isVisible()).toBeTruthy();
  });

  it('should use the default value disabled', () => {
    const wrapper = createWrapper({ disabled: 'true' });

    const input = wrapper.find('.app-time-picker-input__inner');

    expect(input.attributes('disabled')).toBeFalsy();
  });

  it('should display an invalid input', () => {
    const wrapper = createWrapper({ invalid: true });

    const input = wrapper.find('.app-time-picker-input--invalid');

    expect(input.isVisible()).toBeTruthy();
  });

  it('should use the invalid value to props invalid', () => {
    const wrapper = createWrapper({ invalid: 'true' });

    const input = wrapper.element.querySelector(
      '.app-time-picker-input--invalid'
    );

    expect(input).toBeNull();
  });

  it('must be displayed by the placeholder', () => {
    const placeholder = 'Start';
    const wrapper = createWrapper({ placeholder: placeholder });

    const input = wrapper.find('input');

    expect(input.attributes('placeholder')).toBe(placeholder);
  });

  it('should display an init with an empty placeholder', () => {
    const startPlaceholder = 'Start';
    const endPlaceholder = 'End';
    const wrapper = createWrapper({ startPlaceholder, endPlaceholder });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('placeholder')).toBeUndefined();
  });

  it('must display the placeholders for the initial instalment and the final instalment', () => {
    const startPlaceholder = 'Start';
    const endPlaceholder = 'End';
    const wrapper = createWrapper({
      isRange: true,
      startPlaceholder,
      endPlaceholder,
    });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('placeholder')).toBe(startPlaceholder);
    expect(inputs[1].attributes('placeholder')).toBe(endPlaceholder);
  });

  it('should clear the value of', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1),
      clearable: true,
    });

    const button = wrapper.find('.app-time-picker-input__clear');

    await button.trigger('click');

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toBe(null);
  });

  it('should use the default value clearable', () => {
    const wrapper = createWrapper({ clearable: 'true' });

    const button = wrapper.element.querySelector(
      '.app-time-picker-input__clear'
    );
    expect(button).toBeNull();
  });

  const displayPickerModeTestCase: any[] = [
    [false, AppTimeDefaultMode],
    [true, AppTimeRangeMode],
    [1, AppTimeDefaultMode],
    [null, AppTimeDefaultMode],
    [undefined, AppTimeDefaultMode],
  ];

  it.each(displayPickerModeTestCase)(
    'should display the picker in the: mode= %p; component: %p',
    async (isRange, component) => {
      const wrapper = createWrapper({
        isRange,
      });

      await openPopover(wrapper);

      expect(wrapper.findComponent(component).exists()).toBeTruthy();
    }
  );

  const alignPopoverTestCase: any[] = [
    [null, 'bottom-start'],
    [undefined, 'bottom-start'],
    [1, 'bottom-start'],
    ['test', 'bottom-start'],
    [[], 'bottom-start'],
    [{}, 'bottom-start'],
    [true, 'bottom-start'],
    [false, 'bottom-start'],
    ['left', 'bottom-start'],
    ['center', 'bottom'],
    ['right', 'bottom-end'],
  ];

  it.each(alignPopoverTestCase)(
    'should display a picker with the position: align= %p; placement: %p',
    async (align, placement) => {
      const wrapper = createWrapper({
        align,
      });

      expect(wrapper.findComponent(AppPopover).props('placement')).toBe(
        placement
      );
    }
  );

  it('should display the text on the sabbatical and cancel button', async () => {
    const applyText = 'TEST1';
    const cancelText = 'TEST2';

    const wrapper = createWrapper({
      applyText,
      cancelText,
    });

    await openPopover(wrapper);

    const panel = wrapper.findComponent(AppButtonPanel);

    const buttons = panel.findAll('button');

    expect(buttons[0].text()).toBe(cancelText);
    expect(buttons[1].text()).toBe(applyText);
  });

  it('should display the default text on the sabbatical and cancel button', async () => {
    const applyText = 123;
    const cancelText = [];

    const wrapper = createWrapper({
      applyText,
      cancelText,
    });

    await openPopover(wrapper);

    const panel = wrapper.findComponent(AppButtonPanel);

    const buttons = panel.findAll('button');

    expect(buttons[0].text()).toBe('Cancel');
    expect(buttons[1].text()).toBe('Apply');
  });

  it('the picker after opening should always be open', async () => {
    const wrapper = createWrapper({ stayOpened: true });

    const { popover } = await openPopover(wrapper);

    const buttonPanel = wrapper.findComponent(AppButtonPanel);

    expect(buttonPanel.exists()).toBeTruthy();

    const buttons = buttonPanel.findAllComponents(AppButton);

    expect(buttons[0].exists()).toBeTruthy();

    await buttons[0].trigger('click');

    expect(popover.props('modelValue')).toBeTruthy();
  });

  it('after updating the modelValue props update, the inputs have a formatted value', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ modelValue: new Date(2025, 0, 1, 13, 23) });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('13:23:00');
  });

  it('should react to a change in the modelValue value on the same date', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 1, 12, 30) });

    await wrapper.setProps({ modelValue: new Date(2025, 0, 1, 12, 30) });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('12:30:00');
  });

  it('should react to a change in the modelValue value when an invalid value is received', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ modelValue: 'incorrect' });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('');
  });

  it('should react to a change in the modelValue value when the date array arrives', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      modelValue: [new Date(2025, 0, 1, 11), new Date(2025, 0, 5, 12)],
    });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('11:00:00');
  });

  it('should react to a change in the modelValue value when an array of invalid values is received', async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({ modelValue: ['2025', '2024'] });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('');
  });

  it('should display the date relative to the timezone after changing the modelValue', async () => {
    const wrapper = createWrapper({
      timezone: 'America/New_York',
    });

    await wrapper.setProps({ modelValue: new Date(2025, 0, 1) });

    const input = wrapper.find('input');

    expect(input.element.value).toBe('17:00:00');
  });

  it('should display the date relative to the timezone when enabled range mode after changing the modelValue', async () => {
    const wrapper = createWrapper({
      isRange: true,
      timezone: 'America/New_York',
    });

    await wrapper.setProps({
      modelValue: [new Date(2025, 0, 1), new Date(2025, 0, 1)],
    });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].element.value).toBe('17:00:00');
    expect(inputs[1].element.value).toBe('17:00:00');
  });

  it('should display the date relative to the timezone after changing the modelValue when we set non array value', async () => {
    const wrapper = createWrapper({
      isRange: true,
    });

    await wrapper.setProps({
      modelValue: new Date(2025, 0, 1, 15),
    });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].element.value).toBe('15:00:00');
    expect(inputs[1].element.value).toBe('');
  });

  it('inputs should be empty when we set an invalid value', async () => {
    const wrapper = createWrapper({
      isRange: true,
    });

    await wrapper.setProps({
      modelValue: undefined,
    });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].element.value).toBe('');
    expect(inputs[1].element.value).toBe('');
  });

  it('should display the date relative to the change of the type value to a range', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1, 11),
    });

    await wrapper.setProps({ isRange: true });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].element.value).toBe('11:00:00');
    expect(inputs[1].element.value).toBe('');
  });

  it('should display the date relative to the change of the range type value when modelValue was empty', async () => {
    const wrapper = createWrapper({
      modelValue: null,
    });

    await wrapper.setProps({ isRange: true });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].element.value).toBe('');
    expect(inputs[1].element.value).toBe('');
  });

  it('must display the current date when opening a popover', async () => {
    const date = new Date(2025, 0, 1, 14, 20, 30);

    await fakeTimeWrapper(date, async () => {
      const wrapper = createWrapper();

      const { input } = await openPopover(wrapper);

      expect(input.element.value).toBe('14:20:30');

      const bars = wrapper.findAllComponents(AppTimeBar);

      expect(bars[0].props('modelValue')).toBe(14);
      expect(bars[1].props('modelValue')).toBe(20);
      expect(bars[2].props('modelValue')).toBe(30);
    });
  });

  it('should display the date received from modelValue', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1, 14, 20, 30),
    });

    const { input } = await openPopover(wrapper);

    expect(input.element.value).toBe('14:20:30');

    const bars = wrapper.findAllComponents(AppTimeBar);

    expect(bars[0].props('modelValue')).toBe(14);
    expect(bars[1].props('modelValue')).toBe(20);
    expect(bars[2].props('modelValue')).toBe(30);
  });

  it('must give the date with the selected time', async () => {
    const date = new Date(2025, 0, 1, 14, 20, 30);

    await fakeTimeWrapper(date, async () => {
      const wrapper = createWrapper();

      const { input } = await openPopover(wrapper);

      const bars = wrapper.findAllComponents(AppTimeBar);

      await selectElementInBar(bars[0], 13);
      await selectElementInBar(bars[1], 20);
      await selectElementInBar(bars[2], 30);

      expect(input.element.value).toBe('13:20:30');

      await applyValue(wrapper);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')![0][0]).toStrictEqual(
        new Date(2025, 0, 1, 13, 20, 30)
      );
    });
  });

  it('should display the date in AM/PM mode', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1, 14, 20, 30),
      format: 'hh:mm:ss a',
    });

    const { input } = await openPopover(wrapper);

    expect(input.element.value).toBe('02:20:30 PM');

    const bars = wrapper.findAllComponents(AppTimeBar);

    expect(bars[0].props('modelValue')).toBe(2);
    expect(bars[1].props('modelValue')).toBe(20);
    expect(bars[2].props('modelValue')).toBe(30);
    expect(bars[3].props('modelValue')).toBe(1);
  });

  it('must give the date with the selected time when enabled AM/PM mode', async () => {
    const date = new Date(2025, 0, 1, 14, 20, 30);

    await fakeTimeWrapper(date, async () => {
      const wrapper = createWrapper({
        format: 'hh:mm:ss a',
      });

      const { input } = await openPopover(wrapper);

      const bars = wrapper.findAllComponents(AppTimeBar);

      await selectElementInBar(bars[0], 7);
      await selectElementInBar(bars[1], 20);
      await selectElementInBar(bars[2], 30);
      await selectElementInBar(bars[3], 1);

      expect(input.element.value).toBe('07:20:30 PM');

      await applyValue(wrapper);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')![0][0]).toStrictEqual(
        new Date(2025, 0, 1, 19, 20, 30)
      );
    });
  });

  it('must give the date that was transferred only change the time', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 1) });

    const { input } = await openPopover(wrapper);

    const bars = wrapper.findAllComponents(AppTimeBar);

    await selectElementInBar(bars[0], 13);
    await selectElementInBar(bars[1], 20);
    await selectElementInBar(bars[2], 30);

    expect(input.element.value).toBe('13:20:30');

    await applyValue(wrapper);

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toStrictEqual(
      new Date(2025, 0, 1, 13, 20, 30)
    );
  });

  it('must display the date relative to the time zone', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1, 14, 20, 30),
      timezone: 'America/New_York',
    });

    const { input } = await openPopover(wrapper);

    expect(input.element.value).toBe('07:20:30');

    const bars = wrapper.findAllComponents(AppTimeBar);

    expect(bars[0].props('modelValue')).toBe(7);
    expect(bars[1].props('modelValue')).toBe(20);
    expect(bars[2].props('modelValue')).toBe(30);
  });

  it('must give the date in the local timezone when another one is selected in the picker', async () => {
    const date = new Date(2025, 0, 1, 14, 20, 30);

    await fakeTimeWrapper(date, async () => {
      const wrapper = createWrapper({
        timezone: 'America/New_York',
      });

      const { input } = await openPopover(wrapper);

      const bars = wrapper.findAllComponents(AppTimeBar);

      await selectElementInBar(bars[0], 14);
      await selectElementInBar(bars[1], 20);
      await selectElementInBar(bars[2], 30);

      expect(input.element.value).toBe('14:20:30');

      await applyValue(wrapper);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')![0][0]).toStrictEqual(
        new Date(2025, 0, 1, 21, 20, 30)
      );
    });
  });

  it('should display the time relative to the default time parameter', async () => {
    const wrapper = createWrapper({
      defaultTime: new Date(2025, 0, 1, 15),
    });

    const { input } = await openPopover(wrapper);

    expect(input.element.value).toBe('15:00:00');

    const bars = wrapper.findAllComponents(AppTimeBar);

    expect(bars[0].props('modelValue')).toBe(15);
    expect(bars[1].props('modelValue')).toBe(0);
    expect(bars[2].props('modelValue')).toBe(0);
  });

  it('should display the time relative to the default time parameter in the time zone', async () => {
    const wrapper = createWrapper({
      defaultTime: new Date(2025, 0, 1, 15),
      timezone: 'America/New_York',
    });

    const { input } = await openPopover(wrapper);

    expect(input.element.value).toBe('08:00:00');

    const bars = wrapper.findAllComponents(AppTimeBar);

    expect(bars[0].props('modelValue')).toBe(8);
    expect(bars[1].props('modelValue')).toBe(0);
    expect(bars[2].props('modelValue')).toBe(0);
  });

  it('should display the time relative to the default time parameter in the array', async () => {
    const wrapper = createWrapper({
      defaultTime: [new Date(2025, 0, 1, 15, 0, 0)],
    });

    const { input } = await openPopover(wrapper);

    expect(input.element.value).toBe('15:00:00');

    const bars = wrapper.findAllComponents(AppTimeBar);

    expect(bars[0].props('modelValue')).toBe(15);
    expect(bars[1].props('modelValue')).toBe(0);
    expect(bars[2].props('modelValue')).toBe(0);
  });

  it('should display the time relative to the default time parameter in the array relative to the timezone', async () => {
    const wrapper = createWrapper({
      defaultTime: [new Date(2025, 0, 1, 15, 0, 0)],
      timezone: 'America/New_York',
    });

    const { input } = await openPopover(wrapper);

    expect(input.element.value).toBe('08:00:00');

    const bars = wrapper.findAllComponents(AppTimeBar);

    expect(bars[0].props('modelValue')).toBe(8);
    expect(bars[1].props('modelValue')).toBe(0);
    expect(bars[2].props('modelValue')).toBe(0);
  });

  it('should give the time in the local time zone when the time zone setting has not been set', async () => {
    const date = new Date(2025, 0, 1, 14, 20, 29);

    await fakeTimeWrapper(date, async () => {
      const wrapper = createWrapper({ selectableRange: '14:19:29 - 18:20:30' });

      await openPopover(wrapper);

      const bars = wrapper.findAllComponents(AppTimeBar);

      const isDisabledItem = (bar: VueWrapper, index: number) => {
        const items = bar.findAll('li');

        expect(items[index].exists()).toBeTruthy();

        expect(
          items[index].classes('app-time-picker-bar__column__item--disabled')
        ).toBeTruthy();
      };

      isDisabledItem(bars[0], 13);
      isDisabledItem(bars[0], 19);
      isDisabledItem(bars[1], 18);
    });
  });

  it('should display a time that is not in the range in the range mode', async () => {
    const date = new Date(2025, 0, 1, 14, 20, 29);

    await fakeTimeWrapper(date, async () => {
      const wrapper = createWrapper({
        isRange: true,
        selectableRange: ['14:19:29 - 18:20:30', '14:19:29 - 18:20:30'],
      });

      await openPopover(wrapper);

      const bars = wrapper.findAllComponents(AppTimeBar);

      const isDisabledItem = (bar: VueWrapper, index: number) => {
        const items = bar.findAll('li');

        expect(items[index].exists()).toBeTruthy();

        expect(
          items[index].classes('app-time-picker-bar__column__item--disabled')
        ).toBeTruthy();
      };

      isDisabledItem(bars[0], 13);
      isDisabledItem(bars[0], 19);
      isDisabledItem(bars[1], 18);
      isDisabledItem(bars[3], 13);
      isDisabledItem(bars[3], 19);
      isDisabledItem(bars[4], 18);
    });
  });

  it('should display the popover after the focus is called', async () => {
    const wrapper = createWrapper();

    wrapper.vm.focus();
    await wrapper.find('input').trigger('focus');

    const popover = wrapper.findComponent(AppPopover);

    await vi.waitUntil(() => popover.emitted('open'), {
      timeout: 200,
      interval: 2,
    });

    expect(wrapper.findComponent(AppTimeContent).exists()).toBeTruthy();
  });

  it('should close the popover after the blur method was called', async () => {
    const wrapper = createWrapper();

    const { input } = await openPopover(wrapper);

    wrapper.vm.blur();
    await input.trigger('blur');

    expect(wrapper.findComponent(AppPopover).props('modelValue')).toBeFalsy();
  });

  it('must close the popover after pressing the cancel key', async () => {
    const wrapper = createWrapper();

    await openPopover(wrapper);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    document.dispatchEvent(event);

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('should close the popover and give the value when the Enter button is pressed', async () => {
    const date = new Date(2025, 0, 1, 14, 20, 29);

    await fakeTimeWrapper(date, async () => {
      const wrapper = createWrapper();

      await openPopover(wrapper);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      document.dispatchEvent(event);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')![0][0]).toStrictEqual(
        new Date(2025, 0, 1, 14, 20, 29)
      );

      expect(wrapper.emitted('blur')).toBeTruthy();
    });
  });

  it('should not close the popover when the same date is selected and the enter key is pressed', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 1) });

    await openPopover(wrapper);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    document.dispatchEvent(event);

    expect(wrapper.emitted('update:model-value')).toBeFalsy();
    expect(wrapper.emitted('blur')).toBeFalsy();
  });

  it('must close the picker when the blur event has taken place', async () => {
    const wrapper = createWrapper();

    await openPopover(wrapper);

    const event = new Event('blur');

    window.dispatchEvent(event);

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('should not close the picker when the blur event has occurred, but the prop stayOpened = true', async () => {
    const wrapper = createWrapper({ stayOpened: true });

    await openPopover(wrapper);

    const event = new Event('blur');

    window.dispatchEvent(event);

    expect(wrapper.emitted('blur')).toBeFalsy();
  });

  it('should not close the picker when the blur event has occurred, but the prop stayOpened = false', async () => {
    const targetElement = document.createElement('div');
    targetElement.className = 'test-target';
    document.body.appendChild(targetElement);

    const wrapper = createWrapper();

    await openPopover(wrapper);

    const focusinEvent = new Event('focusin', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(focusinEvent, 'target', {
      value: targetElement,
      writable: false,
    });

    window.dispatchEvent(focusinEvent);

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('should close the picker when focus has occurred on an element that has the ignored attribute', async () => {
    const wrapper = createWrapper({
      modelValue: new Date(2025, 0, 1),
      clearable: true,
    });
    await openPopover(wrapper);

    const button = wrapper.element
      .querySelector('.app-time-picker-input__clear')
      .focus();
    const focusinEvent = new Event('focusin', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(focusinEvent, 'target', {
      value: button,
      writable: false,
    });

    window.dispatchEvent(focusinEvent);

    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('the input must have a readonly attribute, but the floor must open', async () => {
    const wrapper = createWrapper({ inputReadonly: true });

    const { popover, input } = await openPopover(wrapper);

    expect(input.element.readOnly).toBeTruthy();
    expect(popover.props('modelValue')).toBeTruthy();
  });

  it('should pass the correct attributes to the default slot', async () => {
    const wrapper = createWrapper(
      { modelValue: new Date(2025, 0, 1) },
      {
        default: `
          <template #default="{ value, popoverVisible, input, focus, blur }">
            <div class="default-slot-content">
              <span class="value">{{ value }}</span>
              <span class="popover-visible">{{ popoverVisible }}</span>
              <button class="focus-button" @click="focus">Focus</button>
              <button class="blur-button" @click="blur">Blur</button>
            </div>
          </template>
        `,
      }
    );

    const defaultSlotContent = wrapper.find('.default-slot-content');
    expect(defaultSlotContent.exists()).toBeTruthy();

    const valueSpan = defaultSlotContent.find('.value');
    const popoverVisibleSpan = defaultSlotContent.find('.popover-visible');
    const focusButton = defaultSlotContent.find('.focus-button');
    const blurButton = defaultSlotContent.find('.blur-button');

    expect(valueSpan.text()).toBe(mockDate.toString());
    expect(popoverVisibleSpan.text()).toBe('false');

    await focusButton.trigger('click');
    expect(wrapper.vm.popoverVisible).toBe(true);

    await blurButton.trigger('click');
    expect(wrapper.vm.popoverVisible).toBe(false);
  });

  it('should set a new picker value through the default slot', async () => {
    const date = new Date(2025, 0, 5, 13, 30, 30);
    const wrapper = createWrapper(
      {},
      {
        default: `
        <template #default="{ value, input, focus  }">
          <div class="default-slot-content">
            <input :value="value" @input="(event) => input(new Date(event.target.value))" @focus="focus" />
          </div>
        </template>
      `,
      }
    );

    const input = wrapper.find('input');

    expect(input.element.value).toBe('');

    await input.setValue(date);

    expect(input.element.value).toBe(date.toString());

    await input.trigger('focus');

    const popover = wrapper.findComponent(AppPopover);

    await vi.waitUntil(() => popover.emitted('open'), {
      timeout: 200,
      interval: 2,
    });

    expect(
      wrapper.findComponent(AppTimeDefaultMode).props('modelValue')
    ).toStrictEqual(date);
  });

  it('should not override the new value received from the default slot, as it is not valid', async () => {
    const date = new Date(2025, 0, 5, 13, 30, 30);
    const wrapper = createWrapper(
      {},
      {
        default: `
        <template #default="{ value, input, focus  }">
          <div class="default-slot-content">
            <input :value="value" @input="(event) => input(event.target.value)" @focus="focus" />
          </div>
        </template>
      `,
      }
    );

    const input = wrapper.find('input');

    expect(input.element.value).toBe('');

    await input.setValue(date);

    expect(input.element.value).toBe(date.toString());

    await input.trigger('focus');

    const popover = wrapper.findComponent(AppPopover);

    await vi.waitUntil(() => popover.emitted('open'), {
      timeout: 200,
      interval: 2,
    });

    expect(input.element.value).toBe(new Date().toString());
  });
});
