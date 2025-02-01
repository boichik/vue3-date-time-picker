import AppYearTable from '@/components/app-date-time-picker/src/components/table/AppYearTable.vue';
import { AppDateTimePickerComponentDataProvide } from '@/components/app-date-time-picker/src/const';
import { mount } from '@vue/test-utils';

describe('AppYearTable', () => {
  const mockToday = new Date(2025, 0, 1);
  const mockDisabledDate = (date: Date) => date.getFullYear() === 2028;

  const provideMock = {
    today: mockToday,
    disabledDate: mockDisabledDate,
  };

  const mountComponent = (props = {}, provide = provideMock) =>
    mount(AppYearTable, {
      props: {
        currentDate: mockToday,
        ...props,
      },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: { value: provide },
        },
      },
    });

  it('render the decade table', () => {
    const wrapper = mountComponent();
    const rows = wrapper.findAll('tr');
    expect(rows).toHaveLength(3);
  });

  it('correctly displays classes for the current year', () => {
    const wrapper = mountComponent();
    const currentYearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell--current-year'
    );
    expect(currentYearCell.exists()).toBe(true);
    expect(currentYearCell.text()).toBe('2025');
  });

  it('correctly displays classes for the selected year', () => {
    const selectedYear = new Date(2026, 0, 1);
    const wrapper = mountComponent({ value: selectedYear });
    const selectedYearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell--selected-year'
    );
    expect(selectedYearCell.exists()).toBe(true);
    expect(selectedYearCell.text()).toBe('2026');
  });

  it('correctly displays classes for an unavailable year', () => {
    const wrapper = mountComponent();
    const disabledYearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell--disabled'
    );
    expect(disabledYearCell.exists()).toBe(true);
    expect(disabledYearCell.text()).toBe('2028');
  });

  it('calls the ‘update’ event when selecting an available year', async () => {
    const wrapper = mountComponent();
    const yearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell:not(.app-date-time-picker-year-table__cell--disabled)'
    );
    await yearCell.trigger('click');

    expect(yearCell.text()).toBe('2020');
    expect(wrapper.emitted('update')).toBeTruthy();
    expect(wrapper.emitted('update')![0][0]).toEqual(new Date(2020, 0, 1));
  });

  it('does not trigger the ‘update’ event when selecting an unavailable year', async () => {
    const wrapper = mountComponent();
    const disabledYearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell--disabled'
    );
    await disabledYearCell.trigger('click');

    expect(wrapper.emitted('update')).toBeFalsy();
  });
});
