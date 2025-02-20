import { mount, VueWrapper } from '@vue/test-utils';
import AppDateTimePickerDayTable from '@/components/app-date-time-picker/src/components/table/AppDayTable.vue';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerDayTableComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
} from '@/components/app-date-time-picker/src/const';
import { isSameDay } from 'date-fns';

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

  const globalTableDataMock = {
    select: vi.fn(),
  };

  const dayTableDataMock = {
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

  const dayTableDataProvideMock = {
    [AppDateTimePickerDayTableComponentDataProvide]: dayTableDataMock,
  };

  const componentDataProvideMock = {
    [AppDateTimePickerComponentDataProvide]: {
      value: mockComponentData,
    },
  };

  const cellsNotOtherMonth = (wrapper: VueWrapper) => {
    const tbody = wrapper.find('tbody');
    const cells = tbody.findAll('.app-date-time-picker-day-table__cell');

    return cells.filter(
      el => !el.classes('app-date-time-picker-day-table__cell--other-month')
    );
  };

  const firstCellClick = async (wrapper: VueWrapper) => {
    const cells = cellsNotOtherMonth(wrapper);
    await cells[0]?.trigger('click');
  };

  const createWrapper = (props = {}, options = {}, provide = {}) => {
    return mount(AppDateTimePickerDayTable, {
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
    mockComponentData.disabledDate.mockReturnValue(false);

    const wrapper = createWrapper({ value: new Date(2025, 0, 1) });
    const selectedCell = wrapper.find(
      '.app-date-time-picker-day-table__cell--selected'
    );

    expect(selectedCell.exists()).toBe(true);
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

    const wrapper = createWrapper({}, {}, dayTableDataProvideMock);

    await firstCellClick(wrapper);

    expect(dayTableDataMock.select).toBeCalled();
    expect(dayTableDataMock.select.mock.calls[0][0]).toStrictEqual(
      new Date(2025, 0, 1)
    );
  });

  it('the date must be selected using the function received through the inject', () => {
    dayTableDataMock.isSelected.mockImplementation((date: Date) => {
      return isSameDay(date, new Date(2025, 0, 1));
    });

    const wrapper = createWrapper({}, {}, dayTableDataProvideMock);

    const selectedCell = wrapper.find(
      '.app-date-time-picker-day-table__cell--selected'
    );

    expect(selectedCell.text()).toBe('1');
  });

  const classNameInSelectedCellCase = [['left'], ['center'], ['right']];

  it.each(classNameInSelectedCellCase)(
    'must be a class of the selected day with the prefix: %i',
    position => {
      dayTableDataMock.isSelected.mockImplementation((date: Date) => {
        if (isSameDay(date, new Date(2025, 0, 1))) {
          return position;
        }

        return null;
      });

      const wrapper = createWrapper({}, {}, dayTableDataProvideMock);

      const selectedCell = wrapper.find(
        `.app-date-time-picker-day-table__cell--selected-${position}`
      );

      expect(selectedCell.exists()).toBeTruthy();
    }
  );

  it('the cell is in the range', () => {
    dayTableDataMock.inRange.mockImplementation((date: Date) =>
      isSameDay(date, new Date(2025, 0, 1))
    );

    const wrapper = createWrapper({}, {}, dayTableDataProvideMock);

    const cells = cellsNotOtherMonth(wrapper);
    expect(
      cells[0].classes('app-date-time-picker-day-table__cell--in-range')
    ).toBeTruthy();
  });

  it('the cell must have the hover in range class', () => {
    dayTableDataMock.isHoverRange.mockImplementation((date: Date) =>
      isSameDay(date, new Date(2025, 0, 1))
    );

    const wrapper = createWrapper({}, {}, dayTableDataProvideMock);

    const cells = cellsNotOtherMonth(wrapper);

    expect(
      cells[0].classes('app-date-time-picker-day-table__cell--hover-range')
    ).toBeTruthy();
  });

  it('should pass the date as a hover', async () => {
    const wrapper = createWrapper({}, {}, dayTableDataProvideMock);
    const cells = cellsNotOtherMonth(wrapper);

    await cells[0].trigger('mouseenter');

    expect(dayTableDataMock.hover).toBeCalled();
    expect(dayTableDataMock.hover.mock.calls[0][0]).toStrictEqual(
      new Date(2025, 0, 1)
    );
  });

  it('should clear the date as hovered', async () => {
    const wrapper = createWrapper({}, {}, dayTableDataProvideMock);
    const cells = cellsNotOtherMonth(wrapper);

    await cells[0].trigger('mouseleave');

    expect(dayTableDataMock.resetHover).toBeCalled();
  });
});
