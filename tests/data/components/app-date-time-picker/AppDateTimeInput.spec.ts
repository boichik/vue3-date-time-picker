import AppDateTimeInput from '@/components/app-date-time-picker/src/components/base/AppDateTimeInput.vue';
import { AppDateTimePickerComponentDataProvide } from '@/components/app-date-time-picker/src/const';
import { TimezoneConvertorImpl } from '@/services/timezone-convertor/TimezoneConvertor';
import AppDateInput from '@/ui/AppDateInput.vue';
import { mount } from '@vue/test-utils';
import { isBefore } from 'date-fns';

describe('AppDateTimeInput', () => {
  const mockProvide = {
    today: new Date(2025, 0, 1),
  };

  const createWrapper = (props = {}, options = {}) =>
    mount(AppDateTimeInput, {
      props: {
        modelValue: null,
        ...props,
      },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: {
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
    expect(wrapper.classes('app-datetime-picker-input--focus')).toBeTruthy();

    await input.trigger('blur');
    expect(wrapper.emitted('blur')).toBeTruthy();
  });

  it('clear date with single input', async () => {
    const wrapper = createWrapper(
      {
        modelValue: new Date(2025, 0, 1),
      },
      { clearable: true }
    );

    const input = wrapper.findComponent(AppDateInput);
    expect(input.exists()).toBeTruthy();

    const internalInput = input.find('input');

    expect(internalInput.element.value).toBe('2025/01/01');

    const clearButton = wrapper.find('button');

    expect(clearButton.isVisible()).toBeTruthy();

    await clearButton.trigger('click');

    expect(internalInput.element.value).toBe('');

    expect(wrapper.emitted('clear')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toBe(null);
  });

  it('clear date with double inputs', async () => {
    const wrapper = createWrapper(
      {
        modelValue: new Date(2025, 0, 1),
      },
      { clearable: true, type: 'daterange' }
    );
    const clearButton = wrapper.find('button');

    expect(clearButton.isVisible()).toBeTruthy();

    await clearButton.trigger('click');
    expect(wrapper.emitted('clear')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toEqual([null, null]);
  });

  it('check is invalid & range classes', () => {
    const wrapper = createWrapper({}, { invalid: true, type: 'daterange' });

    expect(wrapper.classes('app-datetime-picker-input--invalid')).toBeTruthy();
    expect(wrapper.classes('app-datetime-picker-input--range')).toBeTruthy();
  });

  it('check is disabled', () => {
    const wrapper = createWrapper({}, { disabled: true, type: 'daterange' });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('disabled')).toBe('');
    expect(inputs[1].attributes('disabled')).toBe('');
    expect(wrapper.classes('app-datetime-picker-input--disabled')).toBeTruthy();
  });

  it('check is readonly', () => {
    const wrapper = createWrapper({}, { readonly: true, type: 'daterange' });

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('readonly')).toBe('');
    expect(inputs[1].attributes('readonly')).toBe('');
    expect(
      wrapper.classes('app-datetime-picker-input--read-only')
    ).toBeTruthy();
  });

  it('check startPlaceholer', () => {
    const wrapper = createWrapper({}, { placeholder: 'START' });

    const input = wrapper.find('input');

    expect(input.attributes('placeholder')).toBe('START');
  });

  it('check placeholders in range inputs', () => {
    const wrapper = createWrapper(
      {},
      { startPlaceholder: 'START', endPlaceholder: 'END', type: 'daterange' }
    );

    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('placeholder')).toBe('START');
    expect(inputs[1].attributes('placeholder')).toBe('END');
  });

  const checkFormatTestCase: any[] = [
    [{}, 'yyyy/MM/dd'],
    [{ dateFormat: 'test' }, 'test'],
    [{ dateFormat: 'test', combineFormats: true }, 'test'],
    [{ dateFormat: 'test', combineFormats: true, timeFormat: '12' }, 'test'],
    [
      {
        dateFormat: 'test',
        combineFormats: true,
        timeFormat: '12',
        type: 'date',
      },
      'test',
    ],
    [
      {
        dateFormat: 'test',
        combineFormats: true,
        timeFormat: '12',
        type: 'datetime',
      },
      'test 12',
    ],
    [
      {
        dateFormat: 'test',
        combineFormats: true,
        timeFormat: null,
        type: 'datetime',
      },
      'test null',
    ],
    [
      {
        dateFormat: 'test',
        combineFormats: true,
        timeFormat: null,
        type: 'datetimerange',
      },
      'test null',
    ],
    [
      {
        dateFormat: '',
        combineFormats: true,
        timeFormat: null,
        type: 'datetime',
      },
      ' null',
    ],
    [
      {
        dateFormat: 1,
        combineFormats: true,
        timeFormat: null,
        type: 'datetime',
      },
      '1 null',
    ],
    [
      {
        dateFormat: null,
        combineFormats: true,
        timeFormat: null,
        type: 'datetime',
      },
      'null null',
    ],
  ];

  it.each(checkFormatTestCase)(
    'Check format: options= %p; result= %p;',
    (options, result) => {
      expect(
        createWrapper({}, options).findComponent(AppDateInput).props('format')
      ).toBe(result);
    }
  );

  it('check work modelStart with signle input', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 1) });

    const dateInput = wrapper.findComponent(AppDateInput);

    expect(dateInput.props('modelValue')).toStrictEqual(new Date(2025, 0, 1));

    const input = dateInput.find('input');

    await input.setValue(null);

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toBe(null);
  });

  it('check work modelStart with double inputs', async () => {
    const wrapper = createWrapper(
      { modelValue: [null, null] },
      { type: 'daterange' }
    );

    const dateInputs = wrapper.findAllComponents(AppDateInput);

    expect(dateInputs[0].props('modelValue')).toStrictEqual(null);

    const input = dateInputs[0].find('input');

    await input.setValue('2025/01/01');

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toEqual([
      new Date(2025, 0, 1),
      null,
    ]);
  });

  it('check work endStart with double inputs', async () => {
    const wrapper = createWrapper(
      { modelValue: [null, null] },
      { type: 'daterange' }
    );

    const dateInputs = wrapper.findAllComponents(AppDateInput);

    expect(dateInputs[1].props('modelValue')).toStrictEqual(null);

    const input = dateInputs[1].find('input');

    await input.setValue('2025/01/01');

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toEqual([
      null,
      new Date(2025, 0, 1),
    ]);
  });

  const checkDisabledDateTestCase: any[] = [
    ['2025-01-06 14:20:00', {}, '2025/01/01', ''],
    ['2025-01-06 14:20:00', {}, '2025/01/01 14:20:12', ''],
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
