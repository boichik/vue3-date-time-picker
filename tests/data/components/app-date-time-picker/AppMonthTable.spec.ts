import { mount } from '@vue/test-utils';
import { setMonth } from 'date-fns';
import AppMonthTable from '@/components/app-date-time-picker/src/components/table/AppMonthTable.vue';
import { AppDateTimePickerComponentDataProvide } from '@/components/app-date-time-picker/src/const';
describe('AppMonthTable', () => {
  const currentDate = new Date(2025, 0, 1);
  const defaultProps = {
    currentDate,
    value: null,
  };

  const mockComponentData = {
    today: currentDate,
    locale: 'en-US',
    monthCellFormat: 'long',
    disabledDate: vi.fn(),
  };

  const createWrapper = (props = {}, options = {}) => {
    return mount(AppMonthTable, {
      props: { ...defaultProps, ...props },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: {
            value: mockComponentData,
          },
        },
        ...options,
      },
    });
  };

  it('renders all months in the correct structure', () => {
    const wrapper = createWrapper();
    const rows = wrapper.findAll('.app-date-time-picker-month-table tbody tr');
    expect(rows).toHaveLength(3);
    const cells = rows.flatMap(row =>
      row.findAll('.app-date-time-picker-month-table__cell')
    );
    expect(cells).toHaveLength(12);
  });

  it('applies current month class correctly', () => {
    const wrapper = createWrapper();
    const currentMonthCell = wrapper.find(
      '.app-date-time-picker-month-table__cell'
    );
    expect(currentMonthCell.exists()).toBe(true);
    expect(currentMonthCell.text().toLowerCase()).toContain(
      currentDate.toLocaleString('en-US', { month: 'long' }).toLocaleLowerCase()
    );
  });

  it('applies selected month class correctly', () => {
    const selectedDate = setMonth(currentDate, 5);
    const wrapper = createWrapper({ value: selectedDate });
    const selectedMonthCell = wrapper.find(
      '.app-date-time-picker-month-table__cell--selected-month'
    );
    expect(selectedMonthCell.exists()).toBe(true);
    expect(selectedMonthCell.text().toLowerCase()).toContain(
      selectedDate
        .toLocaleString('en-US', { month: 'long' })
        .toLocaleLowerCase()
    );
  });

  it('applies disabled class correctly', () => {
    mockComponentData.disabledDate.mockReturnValue(true);
    const wrapper = createWrapper();
    const disabledCells = wrapper.findAll(
      '.app-date-time-picker-month-table__cell--disabled'
    );
    expect(disabledCells).toHaveLength(12);
  });

  it('emits "update" event with the correct date on month selection', async () => {
    mockComponentData.disabledDate.mockReturnValue(false);

    const wrapper = createWrapper();
    const cell = wrapper.find('.app-date-time-picker-month-table__cell');

    await cell.trigger('click');
    expect(wrapper.emitted('update')).toBeTruthy();
    expect(wrapper.emitted('update')![0][0]).toBeInstanceOf(Date);
  });

  it('does not emit "update" event if month is disabled', async () => {
    mockComponentData.disabledDate.mockReturnValue(true);
    const wrapper = createWrapper();
    const cell = wrapper.find('.app-date-time-picker-month-table__cell');
    await cell.trigger('click');
    expect(wrapper.emitted('update')).toBeFalsy();
  });

  it('formats months according to locale and monthCellFormat', () => {
    const wrapper = createWrapper();
    const cells = wrapper.findAll('.app-date-time-picker-month-table__cell');
    cells.forEach((cell, index) => {
      const expectedMonthName = new Intl.DateTimeFormat('en-US', {
        month: 'long',
      }).format(new Date(2025, index, 1));
      expect(cell.text().toLowerCase()).toContain(
        expectedMonthName.toLowerCase()
      );
    });
  });

  it('renders months in rows of 4', () => {
    const wrapper = createWrapper();
    const rows = wrapper.findAll('.app-date-time-picker-month-table tbody tr');
    rows.forEach(row => {
      expect(
        row.findAll('.app-date-time-picker-month-table__cell')
      ).toHaveLength(4);
    });
  });
});
