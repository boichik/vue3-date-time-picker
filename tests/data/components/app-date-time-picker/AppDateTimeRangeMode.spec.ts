import { mount } from '@vue/test-utils';
import AppDateTimeRangeMode from '@/components/app-date-time-picker/src/components/mode/AppDateTimeRangeMode.vue';
import AppDateTimeController from '@/components/app-date-time-picker/src/components/controller/AppDateTimeController.vue';
import { AppDateTimePickerComponentDataProvide } from '@/components/app-date-time-picker/src/const';
import { isBefore } from 'date-fns';
import AppDayTable from '@/components/app-date-time-picker/src/components/table/AppDayTable.vue';
import AppDateTimePanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimePanel.vue';
import { TimezoneConvertorImpl } from '@/services/timezone-convertor/TimezoneConvertor';
import { initResizeObserverMock } from '@tests/mocks/ResizeObserverMock';
import { fakeTimeZone } from '@tests/mocks/utils';

fakeTimeZone();

describe('AppDateTimeRangeMode', () => {
  initResizeObserverMock();

  const mockDefaultTime = '';
  const mockProvideValue = {
    defaultTime: mockDefaultTime,
    today: new Date(2025, 0, 1),
    monthButtonFormat: 'short',
  };

  const createWrapper = (props = {}, options = {}) =>
    mount(AppDateTimeRangeMode, {
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
      props: {
        modelValue: [],
        ...props,
      },
    });

  const defaultTimeStartTestCase: any[] = [
    [{}, { defaultTime: '12:30:30' }, new Date(2025, 0, 1)],
    [{}, { defaultTime: ['12:30:28'] }, new Date(2025, 0, 1, 12, 30, 28)],
    [{}, { defaultTime: '' }, new Date(2025, 0, 1)],
    [{}, { defaultTime: '123' }, new Date(2025, 0, 1)],
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
    [undefined, undefined, new Date(2025, 0, 1)],
  ];

  it.each(defaultTimeStartTestCase)(
    'the value of startDateDisplay in relation to the parameters: modelValue = %p, options = %p. Result = %p',
    (props, options, result) => {
      const wrapper = createWrapper(props, options);

      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].exists()).toBeTruthy();
      expect(controllers[0].props('modelValue')).toStrictEqual(result);
    }
  );

  it('displaying correct data in calendars relative to the value in modelValue', () => {
    const wrapper = createWrapper({
      modelValue: [new Date(2025, 0, 1), new Date(2025, 2, 15, 12)],
    });

    const timePickerInputs = wrapper.findAll('input');

    expect(timePickerInputs.length).toBeTruthy();

    expect(timePickerInputs[0].element.value).toBe('00:00:00');
    expect(timePickerInputs[1].element.value).toBe('12:00:00');

    const selectedCells = wrapper.findAll(
      '.app-date-time-picker-day-table__cell--selected'
    );

    expect(selectedCells.length).toBeTruthy();

    expect(selectedCells[0].text()).toBe('1');
    expect(selectedCells[1].text()).toBe('15');

    const monthButtons = wrapper.findAll(
      '.app-date-time-picker-panel__date-button--month'
    );

    expect(monthButtons.length).toBeTruthy();

    expect(monthButtons[0].text()).toBe('Jan');
    expect(monthButtons[1].text()).toBe('Mar');
  });

  it('selecting a date via the calendar', async () => {
    const wrapper = createWrapper();

    const dayTables = wrapper.findAllComponents(AppDayTable);

    expect(dayTables.length).toBe(2);

    const startTableCells = dayTables[0]
      .find('tbody')
      .findAll('.app-date-time-picker-day-table__cell')
      .filter(
        el =>
          !el
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

    expect(startTableCells.length).toBeTruthy();

    const endTableCells = dayTables[1]
      .find('tbody')
      .findAll('.app-date-time-picker-day-table__cell')
      .filter(
        el =>
          !el
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

    expect(endTableCells.length).toBeTruthy();

    await startTableCells[12].trigger('click');
    await endTableCells[12].trigger('click');

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toEqual([
      new Date(2025, 0, 13),
      new Date(2025, 1, 13),
    ]);
  });

  it('selecting a date through the calendar when the start date is greater than the end date', async () => {
    const wrapper = createWrapper();

    const dayTable = wrapper.findComponent(AppDayTable);

    expect(dayTable.exists()).toBeTruthy();

    const tableCells = dayTable
      .find('tbody')
      .findAll('.app-date-time-picker-day-table__cell')
      .filter(
        el =>
          !el
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

    expect(tableCells.length).toBeTruthy();

    const [startInput, endInput] = wrapper.findAll('input');

    expect(startInput.exists()).toBeTruthy();
    expect(endInput.exists()).toBeTruthy();

    await tableCells[18].trigger('click');

    expect(startInput.element.value).toBe('00:00:00');
    expect(endInput.element.value).toBe('');

    await tableCells[8].trigger('click');

    expect(endInput.element.value).toBe('00:00:00');

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toEqual([
      new Date(2025, 0, 9),
      new Date(2025, 0, 19),
    ]);
  });

  it('when changing the modelValue value, the selected month is correctly displayed', async () => {
    const wrapper = createWrapper();

    const controllers = wrapper.findAllComponents(AppDateTimeController);

    expect(controllers.length).toBeTruthy();

    expect(controllers[0].props('modelValue')).toStrictEqual(
      new Date(2025, 0, 1)
    );
    expect(controllers[1].props('modelValue')).toStrictEqual(
      new Date(2025, 1, 1)
    );

    await wrapper.setProps({
      modelValue: [new Date(2025, 3, 1), new Date(2025, 8, 2)],
    });

    expect(controllers[0].props('modelValue')).toStrictEqual(
      new Date(2025, 3, 1)
    );
    expect(controllers[1].props('modelValue')).toStrictEqual(
      new Date(2025, 8, 2)
    );
  });

  it('provides correct isDisabledDate function to AppTimePicker', async () => {
    const disabledDateMock = vi.fn(date => {
      const cutoffDate = new Date('2025-01-06 14:20:00');
      return isBefore(date, cutoffDate);
    });

    const wrapper = createWrapper(
      { modelValue: [new Date(2025, 0, 8), new Date(2025, 1, 3)] },
      {
        disabledDate: disabledDateMock,
        timezoneConvertor: new TimezoneConvertorImpl(),
      }
    );

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

    const cellDisabled = cells[4];

    expect(Number(cellDisabled.text())).toBe(5);
    expect(
      cellDisabled.classes('app-date-time-picker-day-table__cell--disabled')
    ).toBeTruthy();

    await cellDisabled.trigger('click');

    expect(wrapper.emitted('update:model-value')).toBeFalsy();

    const cellOne = cells[7];
    const cellTwo = cells[8];
    expect(Number(cellOne.text())).toBe(8);
    expect(Number(cellTwo.text())).toBe(9);

    await cellOne.trigger('click');
    await cellTwo.trigger('click');

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toEqual([
      new Date(2025, 0, 8),
      new Date(2025, 0, 9),
    ]);
  });

  it('adjusts endDateDisplay if startDateDisplay is changed to a later date', async () => {
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2025, 1, 1);
    const wrapper = createWrapper({ modelValue: [startDate, endDate] });

    const panel = wrapper.findAllComponents(AppDateTimePanel);

    expect(panel[0].exists()).toBeTruthy();
    expect(panel[0].props('currentDate')).toBe(startDate);

    const nextMonthButton = panel[0].find(
      '.app-date-time-picker-panel__button--next-month'
    );

    expect(nextMonthButton.exists()).toBeTruthy();

    await nextMonthButton.trigger('click');

    const controllers = wrapper.findAllComponents(AppDateTimeController);

    expect(controllers.length).toBeTruthy();

    expect(controllers[0].props('modelValue')).toStrictEqual(
      new Date(2025, 1, 1)
    );
    expect(controllers[1].props('modelValue')).toStrictEqual(
      new Date(2025, 2, 1)
    );
  });

  it('adjusts startDateDisplay if endDateDisplay is changed to an earlier date', async () => {
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2025, 1, 1);
    const wrapper = createWrapper({ modelValue: [startDate, endDate] });

    const panel = wrapper.findAllComponents(AppDateTimePanel);

    expect(panel[1].exists()).toBeTruthy();
    expect(panel[1].props('currentDate')).toBe(endDate);

    const prevMonthButton = panel[1].find(
      '.app-date-time-picker-panel__button--prev-month'
    );

    expect(prevMonthButton.exists()).toBeTruthy();

    await prevMonthButton.trigger('click');

    const controllers = wrapper.findAllComponents(AppDateTimeController);

    expect(controllers.length).toBeTruthy();

    expect(controllers[0].props('modelValue')).toStrictEqual(
      new Date(2024, 11, 1)
    );
    expect(controllers[1].props('modelValue')).toStrictEqual(
      new Date(2025, 0, 1)
    );
  });
});
