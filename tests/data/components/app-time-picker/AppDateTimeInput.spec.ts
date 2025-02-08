import { mount } from '@vue/test-utils';
import { isBefore, set } from 'date-fns';
import AppTimeInput from '@/components/app-time-picker/src/components/base/AppTimeInput.vue';
import AppDateInput from '@/ui/AppDateInput.vue';
import { AppTimePickerComponentDataProvide } from '@/components/app-time-picker/src/const';
import { TimezoneConvertorImpl } from '@/services/timezone-convertor/TimezoneConvertor';

describe('AppTimeInput', () => {
  const mockProvide = {
    today: new Date(2025, 0, 1),
    format: 'HH:mm:ss',
  };

  const createWrapper = (props = {}, options = {}) =>
    mount(AppTimeInput, {
      props: {
        modelValue: null,
        ...props,
      },
      global: {
        provide: {
          [AppTimePickerComponentDataProvide]: {
            value: {
              ...mockProvide,
              ...options,
            },
          },
        },
      },
    });

  it('checking the work of emit focus & blur', async () => {
    const wrapper = createWrapper();

    const input = wrapper.findComponent(AppDateInput);

    expect(input.exists()).toBeTruthy();

    await input.trigger('focus');

    expect(wrapper.emitted('focus')).toBeTruthy();
    expect(wrapper.classes('app-time-picker-input--focus')).toBeTruthy();

    await input.trigger('blur');
    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('clear time with single input', async () => {
    const wrapper = createWrapper(
      {
        modelValue: new Date(2025, 0, 1, 12, 0),
      },
      { clearable: true }
    );

    const input = wrapper.findComponent(AppDateInput);
    expect(input.exists()).toBeTruthy();

    const internalInput = input.find('input');

    expect(internalInput.element.value).toBe('12:00:00');

    const clearButton = wrapper.find('button');

    expect(clearButton.isVisible()).toBeTruthy();

    await clearButton.trigger('click');

    expect(internalInput.element.value).toBe('');

    expect(wrapper.emitted('clear')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toBe(null);
  });

  it('clear time with double inputs', async () => {
    const wrapper = createWrapper(
      {
        modelValue: [new Date(2025, 0, 1, 12, 0), new Date(2025, 0, 1, 13, 0)],
      },
      { clearable: true, isRange: true }
    );
    const clearButton = wrapper.find('button');

    expect(clearButton.isVisible()).toBeTruthy();

    await clearButton.trigger('click');
    expect(wrapper.emitted('clear')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toEqual([null, null]);
  });

  it('check is invalid & range classes', () => {
    const wrapper = createWrapper({}, { invalid: true, isRange: true });

    expect(wrapper.classes('app-time-picker-input--invalid')).toBeTruthy();
    expect(wrapper.classes('app-time-picker-input--range')).toBeTruthy();
  });

  it('check is disabled', () => {
    const wrapper = createWrapper({}, { disabled: true, isRange: true });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('disabled')).toBe('');
    expect(inputs[1].attributes('disabled')).toBe('');
    expect(wrapper.classes('app-time-picker-input--disabled')).toBeTruthy();
  });

  it('check is readonly', () => {
    const wrapper = createWrapper({}, { readonly: true, isRange: true });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('readonly')).toBe('');
    expect(inputs[1].attributes('readonly')).toBe('');
    expect(wrapper.classes('app-time-picker-input--read-only')).toBeTruthy();
  });

  it('check startPlaceholder', () => {
    const wrapper = createWrapper({}, { placeholder: 'START' });

    const input = wrapper.find('input');

    expect(input.attributes('placeholder')).toBe('START');
  });

  it('check placeholders in range inputs', () => {
    const wrapper = createWrapper(
      {},
      { startPlaceholder: 'START', endPlaceholder: 'END', isRange: true }
    );

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('placeholder')).toBe('START');
    expect(inputs[1].attributes('placeholder')).toBe('END');
  });

  const checkFormatTestCase: any[] = [
    [{}, 'HH:mm:ss'],
    [{ format: 'test' }, 'test'],
  ];

  it.each(checkFormatTestCase)(
    'Check format: options= %p; result= %p;',
    (options, result) => {
      expect(
        createWrapper({}, options).findComponent(AppDateInput).props('format')
      ).toBe(result);
    }
  );

  it('check work modelStart with single input', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 1, 12, 0) });

    const dateInput = wrapper.findComponent(AppDateInput);

    expect(dateInput.props('modelValue')).toStrictEqual(
      new Date(2025, 0, 1, 12, 0)
    );

    const input = dateInput.find('input');

    await input.setValue(null);

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toBe(null);
  });

  it('check work modelStart with double inputs', async () => {
    const wrapper = createWrapper(
      { modelValue: [null, null] },
      { isRange: true }
    );

    const dateInputs = wrapper.findAllComponents(AppDateInput);

    expect(dateInputs[0].props('modelValue')).toStrictEqual(null);

    const input = dateInputs[0].find('input');

    await input.setValue('12:00:00');

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toEqual([
      set(new Date(), { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }),
      null,
    ]);
  });

  it('check work modelEnd with double inputs', async () => {
    const wrapper = createWrapper(
      { modelValue: [null, null] },
      { isRange: true }
    );

    const dateInputs = wrapper.findAllComponents(AppDateInput);

    expect(dateInputs[1].props('modelValue')).toStrictEqual(null);

    const input = dateInputs[1].find('input');

    await input.setValue('13:00:00');

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toEqual([
      null,
      set(new Date(), { hours: 13, minutes: 0, seconds: 0, milliseconds: 0 }),
    ]);
  });

  const checkDisabledDateTestCase: any[] = [
    ['2025-01-06 14:20:00', {}, '12:00', ''],
    ['2025-01-06 14:20:00', {}, '14:20', ''],
  ];

  it.each(checkDisabledDateTestCase)(
    'Check disabled date: disabledDate= %p; options= %p; inputDate= %p; result = %p;',
    async (disabledDate, options, inputDate, result) => {
      const disabledDateMock = vi.fn(date => {
        const cutoffDate = new Date(disabledDate);
        return isBefore(date, cutoffDate);
      });

      const wrapper = createWrapper(
        {},
        {
          disabledDate: disabledDateMock,
          timezoneConvertor: new TimezoneConvertorImpl(),
          ...options,
        }
      );

      const input = wrapper.find('input');

      await input.setValue(inputDate);

      await input.trigger('blur');

      expect(input.element.value).toBe(result);
    }
  );
});
