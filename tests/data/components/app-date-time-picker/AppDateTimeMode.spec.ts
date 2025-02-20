import { mount } from '@vue/test-utils';
import AppDateMode from '@/components/app-date-time-picker/src/components/mode/AppDateMode.vue';
import { AppTimePicker } from '@/components/app-time-picker';
import AppDateTimeController from '@/components/app-date-time-picker/src/components/controller/AppDateTimeController.vue';
import { AppDateTimePickerComponentDataProvide } from '@/components/app-date-time-picker/src/const';
import AppDayTable from '@/components/app-date-time-picker/src/components/table/AppDayTable.vue';
import { TimezoneConvertorImpl } from '@/services/timezone-convertor/TimezoneConvertor';
import AppTimeInput from '@/components/app-time-picker/src/components/base/AppTimeInput.vue';
import { isBefore } from 'date-fns';
import { initResizeObserverMock } from '@tests/mocks/ResizeObserverMock';
import { AppDateTimePickerType } from '@/components/app-date-time-picker/src/enums/dateTimePickerType';
import { AppDateTimePickerMode } from '@/components/app-date-time-picker/src/enums/dateTimePickerMode';

describe('AppDateTimeMode', () => {
  initResizeObserverMock();

  const mockProvideValue = {
    today: new Date(2025, 0, 1),
    defaultTime: '12:00:00',
    timeFormat: 'HH:mm:ss',
    type: AppDateTimePickerType.DateTime,
    mode: AppDateTimePickerMode.Day,
    disabledDate: vi.fn(),
    timezoneConvertor: new TimezoneConvertorImpl(),
    timeOptions: { placeholder: 'Select time' },
  };

  const createWrapper = (props = {}, options = {}) => {
    return mount(AppDateMode, {
      propsData: {
        modelValue: null,
        ...props,
      },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: {
            value: {
              ...mockProvideValue,
              ...options,
            },
          },
        },
      },
    });
  };

  it('renders AppTimePicker and AppDateTimeController components', () => {
    const wrapper = createWrapper();

    expect(wrapper.findComponent(AppTimePicker).exists()).toBe(true);
    expect(wrapper.findComponent(AppDateTimeController).exists()).toBe(true);
  });

  const defaultTimeTestCase: any[] = [
    [
      { modelValue: new Date(2025, 1, 1) },
      { defaultTime: '12:30:30' },
      new Date(2025, 1, 1),
    ],
    [{}, { defaultTime: ['12:30:28'] }, new Date(2025, 0, 1, 12, 30, 28)],
    [{}, { defaultTime: '' }, new Date(2025, 0, 1)],
    [{}, { defaultTime: '123' }, new Date(2025, 0, 6, 3)],
    [{}, { defaultTime: 'abc' }, new Date(2025, 0, 1)],
    [{}, { defaultTime: 0 }, new Date(2025, 0, 1)],
    [{}, { defaultTime: 123 }, new Date(2025, 0, 1)],
    [{}, { defaultTime: undefined }, new Date(2025, 0, 1)],
    [{}, { defaultTime: null }, new Date(2025, 0, 1)],
    [{}, { defaultTime: NaN }, new Date(2025, 0, 1)],
    [{}, { defaultTime: [] }, new Date(2025, 0, 1)],
    [{}, { defaultTime: {} }, new Date(2025, 0, 1)],
    [{}, { defaultTime: [''] }, new Date(2025, 0, 1)],
    [{}, { defaultTime: ['123'] }, new Date(2025, 0, 6, 3)],
    [{}, { defaultTime: ['abc'] }, new Date(2025, 0, 1)],
    [{}, { defaultTime: [0] }, new Date(2025, 0, 1)],
    [{}, { defaultTime: [123] }, new Date(2025, 0, 1)],
    [{}, { defaultTime: [undefined] }, new Date(2025, 0, 1)],
    [{}, { defaultTime: [null] }, new Date(2025, 0, 1)],
    [{}, { defaultTime: [NaN] }, new Date(2025, 0, 1)],
    [{}, { defaultTime: [[]] }, new Date(2025, 0, 1)],
    [{}, { defaultTime: [{}] }, new Date(2025, 0, 1)],
    [undefined, undefined, new Date(2025, 0, 1, 12)],
  ];

  it.each(defaultTimeTestCase)(
    'the value of currentDateDisplay in relation to the parameters: modelValue = %p, options = %p. Result = %p',
    (props, options, result) => {
      const wrapper = createWrapper(props, options);

      const controller = wrapper.findComponent(AppDateTimeController);

      expect(controller.exists()).toBeTruthy();
      expect(controller.props('modelValue')).toStrictEqual(result);
    }
  );

  const testCase: any[] = [
    [{}, new Date(2025, 0, 5, 12)],
    [{ defaultTime: '13:00:00' }, new Date(2025, 0, 5, 13)],
    [{ defaultTime: [] }, new Date(2025, 0, 5)],
    [{ defaultTime: [''] }, new Date(2025, 0, 5)],
    [{ defaultTime: [null] }, new Date(2025, 0, 5)],
    [{ defaultTime: [undefined] }, new Date(2025, 0, 5)],
    [{ defaultTime: [0] }, new Date(2025, 0, 5)],
    [{ defaultTime: [123] }, new Date(2025, 0, 5)],
    [{ defaultTime: ['123'] }, new Date(2025, 0, 5, 3)],
    [{ defaultTime: ['abc'] }, new Date(2025, 0, 5)],
    [{ defaultTime: '' }, new Date(2025, 0, 5)],
    [{ defaultTime: null }, new Date(2025, 0, 5)],
    [{ defaultTime: undefined }, new Date(2025, 0, 5)],
    [{ defaultTime: 0 }, new Date(2025, 0, 5)],
    [{ defaultTime: NaN }, new Date(2025, 0, 5)],
    [{ defaultTime: ['13:12:12'] }, new Date(2025, 0, 5, 13, 12, 12)],
    [{ defaultTime: '13:00' }, new Date(2025, 0, 5, 13)],
    [{ defaultTime: '13' }, new Date(2025, 0, 5, 13)],
    [{ defaultTime: '28:00:00' }, new Date(2025, 0, 5, 4)],
  ];

  it.each(testCase)(
    'We get the date along with the time when provideOptions = %p, result = %p',
    async (options, result) => {
      mockProvideValue.disabledDate.mockImplementation(() => false);

      const wrapper = createWrapper({}, options);

      const dayTable = wrapper.findComponent(AppDayTable);

      expect(dayTable.exists()).toBeTruthy();

      const cells = dayTable
        .find('tbody')
        .findAll('.app-date-time-picker-day-table__cell')
        .filter(
          el =>
            !el
              .classes()
              .includes('app-date-time-picker-day-table__cell--other-month')
        );

      expect(cells.length).toBeTruthy();

      const cell = cells[4];

      expect(Number(cell.text())).toBe(5);

      await cell.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toStrictEqual(result);
    }
  );

  it('passes correct props to AppTimePicker', async () => {
    const wrapper = createWrapper({ modelValue: new Date(2025, 0, 1) });

    const timePickerInputComponent = wrapper.findComponent(AppTimeInput);

    expect(timePickerInputComponent.exists()).toBeTruthy();

    const input = timePickerInputComponent.find('input');

    expect(input.isVisible()).toBeTruthy();
    expect(input.attributes('placeholder')).toBe('Select time');
    expect(input.element.value).toBe('00:00:00');
  });

  it('provides correct isDisabledDate function to AppTimePicker', async () => {
    const disabledDateMock = vi.fn(date => {
      const cutoffDate = new Date('2025-01-06 14:20:00');
      return isBefore(date, cutoffDate);
    });

    const wrapper = createWrapper({}, { disabledDate: disabledDateMock });

    const dayTable = wrapper.findComponent(AppDayTable);

    expect(dayTable.exists()).toBeTruthy();

    const cells = dayTable
      .find('tbody')
      .findAll('.app-date-time-picker-day-table__cell')
      .filter(
        el =>
          !el
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

    expect(cells.length).toBeTruthy();

    const cellDisabled = cells[5];

    expect(Number(cellDisabled.text())).toBe(6);
    expect(
      cellDisabled.classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeTruthy();

    await cellDisabled.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeFalsy();

    const cellAvailable = cells[6];
    expect(Number(cellAvailable.text())).toBe(7);

    await cellAvailable.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });
});
