import { mount, VueWrapper } from '@vue/test-utils';
import { isSameMonth, setMonth } from 'date-fns';
import AppMonthTable from '@/components/app-date-time-picker/src/components/table/AppMonthTable.vue';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
  AppDateTimePickerMonthTableComponentDataProvide,
} from '@/components/app-date-time-picker/src/const';
import { AppDateTimePickerMode } from '@/components/app-date-time-picker/src/enums/dateTimePickerMode';
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

  const globalTableDataMock = {
    select: vi.fn(),
  };

  const monthTableDataMock = {
    inRange: vi.fn(),
    isHoverRange: vi.fn(),
    isSelected: vi.fn(),
    select: vi.fn(),
    hover: vi.fn(),
    resetHover: vi.fn(),
  };

  const globalTableDataProvideMock = {
    [AppDateTimePickerGlobalTableComponentDataProvide]: globalTableDataMock,
  };

  const monthTableDataProvideMock = {
    [AppDateTimePickerMonthTableComponentDataProvide]: monthTableDataMock,
  };

  const componentDataProvideMock = {
    [AppDateTimePickerComponentDataProvide]: {
      value: mockComponentData,
    },
  };

  const firstCellClick = async (wrapper: VueWrapper) => {
    const cell = wrapper.find('.app-date-time-picker-month-table__cell');
    await cell.trigger('click');
  };

  const createWrapper = (props = {}, options = {}, provide = {}) => {
    return mount(AppMonthTable, {
      props: { ...defaultProps, ...props },
      global: {
        provide: {
          ...componentDataProvideMock,
          ...provide,
        },
        ...options,
      },
    });
  };

  beforeEach(() => vi.resetAllMocks());

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

    await firstCellClick(wrapper);

    expect(wrapper.emitted('update')).toBeTruthy();
    expect(wrapper.emitted('update')![0][0]).toBeInstanceOf(Date);
  });

  it('does not emit "update" event if month is disabled', async () => {
    mockComponentData.disabledDate.mockReturnValue(true);
    const wrapper = createWrapper();

    await firstCellClick(wrapper);

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

  it('should not call the global selector function, since there is no ‘day’ mode', async () => {
    mockComponentData.disabledDate.mockReturnValue(false);

    const provide = {
      [AppDateTimePickerComponentDataProvide]: {
        value: {
          ...mockComponentData,
          mode: AppDateTimePickerMode.Day,
        },
      },
      ...globalTableDataProvideMock,
    };

    const wrapper = createWrapper({}, {}, provide);

    await firstCellClick(wrapper);

    expect(globalTableDataMock.select).not.toBeCalled();
  });

  it('must call the global selector function', async () => {
    mockComponentData.disabledDate.mockReturnValue(false);

    const wrapper = createWrapper({}, {}, globalTableDataProvideMock);

    await firstCellClick(wrapper);

    expect(globalTableDataMock.select).toBeCalled();
    expect(globalTableDataMock.select.mock.calls[0][0]).toStrictEqual(
      new Date(2025, 0, 1)
    );
  });

  it('must call the local selector function', async () => {
    mockComponentData.disabledDate.mockReturnValue(false);

    const wrapper = createWrapper({}, {}, monthTableDataProvideMock);

    await firstCellClick(wrapper);

    expect(monthTableDataMock.select).toBeCalled();
    expect(monthTableDataMock.select.mock.calls[0][0]).toStrictEqual(
      new Date(2025, 0, 1)
    );
  });

  it('should not call the local selector function, since there is no ‘day’ mode', async () => {
    mockComponentData.disabledDate.mockReturnValue(false);

    const provide = {
      [AppDateTimePickerComponentDataProvide]: {
        value: {
          ...mockComponentData,
          mode: AppDateTimePickerMode.Day,
        },
      },
      ...monthTableDataProvideMock,
    };

    const wrapper = createWrapper({}, {}, provide);

    await firstCellClick(wrapper);

    expect(monthTableDataMock.select).not.toBeCalled();
  });

  it('the date must be selected using the function received through the inject', () => {
    monthTableDataMock.isSelected.mockImplementation((date: Date) => {
      return isSameMonth(date, new Date(2025, 3, 1));
    });

    const wrapper = createWrapper({}, {}, monthTableDataProvideMock);

    const selectedMonthCell = wrapper.find(
      '.app-date-time-picker-month-table__cell--selected-month'
    );

    expect(selectedMonthCell.text()).toBe('April');
  });

  const classNameInSelectedCellCase = [['left'], ['center'], ['right']];

  it.each(classNameInSelectedCellCase)(
    'must be a class of the selected month with the prefix: %i',
    position => {
      monthTableDataMock.isSelected.mockImplementation((date: Date) => {
        if (isSameMonth(date, new Date(2025, 3, 1))) {
          return position;
        }

        return null;
      });

      const wrapper = createWrapper({}, {}, monthTableDataProvideMock);

      const selectedMonthCell = wrapper.find(
        `.app-date-time-picker-month-table__cell--selected-month--${position}`
      );

      expect(selectedMonthCell.exists()).toBeTruthy();
    }
  );

  it('the cell is in the range', () => {
    monthTableDataMock.inRange.mockImplementation((date: Date) =>
      isSameMonth(date, new Date(2025, 0, 1))
    );

    const wrapper = createWrapper({}, {}, monthTableDataProvideMock);

    const cell = wrapper.find('.app-date-time-picker-month-table__cell');
    expect(
      cell.classes('app-date-time-picker-month-table__cell--in-range')
    ).toBeTruthy();
  });

  it('the cell must have the hover in range class', () => {
    monthTableDataMock.isHoverRange.mockImplementation((date: Date) =>
      isSameMonth(date, new Date(2025, 0, 1))
    );

    const wrapper = createWrapper({}, {}, monthTableDataProvideMock);

    const cell = wrapper.find('.app-date-time-picker-month-table__cell');
    expect(
      cell.classes('app-date-time-picker-month-table__cell--hover-range')
    ).toBeTruthy();
  });

  it('should pass the date as a hover', async () => {
    const wrapper = createWrapper({}, {}, monthTableDataProvideMock);
    const cell = wrapper.find('.app-date-time-picker-month-table__cell');

    await cell.trigger('mouseenter');

    expect(monthTableDataMock.hover).toBeCalled();
    expect(monthTableDataMock.hover.mock.calls[0][0]).toStrictEqual(
      new Date(2025, 0, 1)
    );
  });

  it('should clear the date as hovered', async () => {
    const wrapper = createWrapper({}, {}, monthTableDataProvideMock);
    const cell = wrapper.find('.app-date-time-picker-month-table__cell');

    await cell.trigger('mouseleave');

    expect(monthTableDataMock.resetHover).toBeCalled();
  });
});
