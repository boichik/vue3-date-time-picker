import { mount } from '@vue/test-utils';
import AppDateTimePickerDayTable from '@/components/app-date-time-picker/src/components/table/AppDayTable.vue';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerTableComponentDataProvide,
} from '@/components/app-date-time-picker/src/const';

describe('AppDayTable', () => {
  const currentDate = new Date(2025, 0, 15);
  const defaultProps = {
    currentDate,
    value: null,
  };

  const mockComponentData = {
    firstDayOfWeek: 1,
    today: currentDate,
    locale: 'en-US',
    weekdayFormat: 'short',
    disabledDate: vi.fn(),
  };

  const mockTableComponentData = {
    isSelectedDate: vi.fn(),
    isDateInRange: vi.fn(),
    isDateHoverRange: vi.fn(),
    selectDate: vi.fn(),
    hoverDate: vi.fn(),
    resetHover: vi.fn(),
  };

  const createWrapper = (props = {}, options = {}) => {
    return mount(AppDateTimePickerDayTable, {
      props: { ...defaultProps, ...props },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: { value: mockComponentData },
          [AppDateTimePickerTableComponentDataProvide]: mockTableComponentData,
        },
        ...options,
      },
    });
  };

  it('renders the correct number of days', () => {
    const wrapper = createWrapper();

    const thead = wrapper.find('thead');
    const cellsWeek = thead.findAll('.app-date-time-picker-day-table__cell');
    expect(cellsWeek).toHaveLength(7);

    const tbody = wrapper.find('tbody');
    const cells = tbody.findAll('.app-date-time-picker-day-table__cell');
    expect(cells).toHaveLength(42);
  });

  it('renders days in the correct order', () => {
    const wrapper = createWrapper();

    const tbody = wrapper.find('tbody');
    const cells = tbody.findAll('.app-date-time-picker-day-table__cell');

    const cell = cells
      .find(
        el =>
          !el
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      )!
      .text();

    expect(Number(cell)).toBe(1);
  });

  it('highlights today correctly', () => {
    const wrapper = createWrapper();
    const todayCell = wrapper.find(
      '.app-date-time-picker-day-table__cell--current-day'
    );
    expect(todayCell.exists()).toBe(true);
  });

  it('applies disabled class to days as per disabledDate function', () => {
    mockComponentData.disabledDate.mockReturnValue(true);
    const wrapper = createWrapper();
    const disabledCells = wrapper.findAll(
      '.app-date-time-picker-day-table__cell--disabled'
    );

    expect(disabledCells.length).toBeGreaterThan(0);
  });

  it('applies selected class to the correct day', () => {
    mockTableComponentData.isSelectedDate.mockImplementation(date => {
      return date.getDate() === currentDate.getDate();
    });

    const wrapper = createWrapper();
    const selectedCell = wrapper.find(
      '.app-date-time-picker-day-table__cell--selected'
    );

    expect(selectedCell.exists()).toBe(true);
  });

  it('handles date selection on click', async () => {
    mockComponentData.disabledDate.mockImplementation(() => false);

    const wrapper = createWrapper();
    const tbody = wrapper.find('tbody');
    const cells = tbody.findAll('.app-date-time-picker-day-table__cell');

    const cell = cells.find(
      el =>
        !el
          .classes()
          .includes('app-date-time-picker-day-table__cell--other-month')
    )!;
    await cell.trigger('click');

    expect(mockTableComponentData.selectDate).toHaveBeenCalled();
  });

  it('handles hover events correctly', async () => {
    const wrapper = createWrapper();
    const tbody = wrapper.find('tbody');
    const cells = tbody.findAll('.app-date-time-picker-day-table__cell');

    const cell = cells.find(
      el =>
        !el
          .classes()
          .includes('app-date-time-picker-day-table__cell--other-month')
    )!;

    await cell.trigger('mouseenter');

    expect(mockTableComponentData.hoverDate).toHaveBeenCalled();

    await cell.trigger('mouseleave');
    expect(mockTableComponentData.resetHover).toHaveBeenCalled();
  });

  it('renders reordered weekdays correctly based on firstDayOfWeek', () => {
    const wrapper = createWrapper();
    const headers = wrapper.findAll(
      '.app-date-time-picker-day-table__weekdays .app-date-time-picker-day-table__cell-content'
    );
    const renderedDays = headers.map(header => header.text());

    const expectedOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    expect(renderedDays).toEqual(expectedOrder);
  });
});
