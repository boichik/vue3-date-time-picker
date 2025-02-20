import { mount } from '@vue/test-utils';
import AppDateRangeMode from '@/components/app-date-time-picker/src/components/mode/AppDateRangeMode.vue';
import AppDateTimeController from '@/components/app-date-time-picker/src/components/controller/AppDateTimeController.vue';
import { AppDateTimePickerComponentDataProvide } from '@/components/app-date-time-picker/src/const';
import { ref } from 'vue';
import { setTime } from '@/components/app-date-time-picker/src/utils';
import { addMonths } from 'date-fns';
import AppDayTable from '@/components/app-date-time-picker/src/components/table/AppDayTable.vue';
import AppDateTimePanel from '@/components/app-date-time-picker/src/components/panel/AppDateTimePanel.vue';
import { AppDateTimePickerMode } from '@/components/app-date-time-picker/src/enums/dateTimePickerMode';

describe('AppDateRangeMode', () => {
  const mockDate = new Date(2025, 0, 1);
  const mockDefaultTime = '';
  const mockProvideValue = ref({
    defaultTime: mockDefaultTime,
    today: mockDate,
    mode: AppDateTimePickerMode.Day,
  });

  const mountComponent = (modelValue: any = []) =>
    mount(AppDateRangeMode, {
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: mockProvideValue,
        },
      },
      props: {
        modelValue,
      },
    });

  it('render two AppDateTimeController components', () => {
    const wrapper = mountComponent();
    const controllers = wrapper.findAllComponents(AppDateTimeController);

    expect(controllers).toHaveLength(2);
  });

  it('initialises startDateDisplay and endDateDisplay based on modelValue', () => {
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2025, 1, 1);
    const wrapper = mountComponent([startDate, endDate]);

    const controllers = wrapper.findAllComponents(AppDateTimeController);

    expect(controllers.length).toBeTruthy();

    expect(controllers[0].props('modelValue')).toEqual(startDate);
    expect(controllers[1].props('modelValue')).toEqual(endDate);
  });

  it('sets initial values if modelValue is empty', () => {
    const wrapper = mountComponent();

    const expectedStartDate = setTime(mockDate, mockDefaultTime);
    const expectedEndDate = addMonths(expectedStartDate, 1);

    const controllers = wrapper.findAllComponents(AppDateTimeController);

    expect(controllers.length).toBeTruthy();

    expect(controllers[0].props('modelValue')).toEqual(expectedStartDate);
    expect(controllers[1].props('modelValue')).toEqual(expectedEndDate);
  });

  it('updates startDateDisplay and endDateDisplay when modelValue changes', async () => {
    const initialStartDate = new Date(2025, 0, 1);
    const initialEndDate = new Date(2025, 1, 1);
    const wrapper = mountComponent([initialStartDate, initialEndDate]);

    const newStartDate = new Date(2025, 2, 1);
    const newEndDate = new Date(2025, 3, 1);

    await wrapper.setProps({ modelValue: [newStartDate, newEndDate] });

    const controllers = wrapper.findAllComponents(AppDateTimeController);

    expect(controllers.length).toBeTruthy();

    expect(controllers[0].props('modelValue')).toEqual(newStartDate);
    expect(controllers[1].props('modelValue')).toEqual(newEndDate);
  });

  it('ensures the correct date order when selecting a range', async () => {
    const earlierDate = new Date(2025, 0, 1);
    const laterDate = new Date(2025, 1, 1);

    const wrapper = mountComponent([earlierDate, laterDate]);

    const dayTable = wrapper.findAllComponents(AppDayTable);

    const cells = dayTable[1]
      .find('tbody')
      .findAll('.app-date-time-picker-day-table__cell')
      .filter(
        el =>
          !el
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

    expect(cells.length).toBeTruthy();

    const firstCell = cells[8];
    const lastCell = cells[16];

    expect(Number(firstCell.text())).toBe(9);
    expect(Number(lastCell.text())).toBe(17);

    await lastCell.trigger('click');

    expect(
      lastCell.classes('app-date-time-picker-day-table__cell--selected')
    ).toBeTruthy();

    await firstCell.trigger('click');

    expect(
      firstCell.classes('app-date-time-picker-day-table__cell--selected')
    ).toBeTruthy();

    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')![0][0]).toStrictEqual([
      new Date(2025, 1, 9),
      new Date(2025, 1, 17),
    ]);
  });

  it('adjusts endDateDisplay if startDateDisplay is changed to a later date', async () => {
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2025, 1, 1);
    const wrapper = mountComponent([startDate, endDate]);

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
    const wrapper = mountComponent([startDate, endDate]);

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
