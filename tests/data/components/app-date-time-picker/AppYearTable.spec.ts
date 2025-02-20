import AppYearTable from '@/components/app-date-time-picker/src/components/table/AppYearTable.vue';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
  AppDateTimePickerYearTableComponentDataProvide,
} from '@/components/app-date-time-picker/src/const';
import { AppDateTimePickerMode } from '@/components/app-date-time-picker/src/enums/dateTimePickerMode';
import { mount, VueWrapper } from '@vue/test-utils';
import { isSameYear } from 'date-fns/isSameYear';

describe('AppYearTable', () => {
  const mockToday = new Date(2025, 0, 1);

  const mockComponentData = {
    today: mockToday,
    disabledDate: vi.fn(),
  };

  const globalTableDataMock = {
    select: vi.fn(),
  };

  const yearTableDataMock = {
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

  const yearTableDataProvideMock = {
    [AppDateTimePickerYearTableComponentDataProvide]: yearTableDataMock,
  };

  const componentDataProvideMock = {
    [AppDateTimePickerComponentDataProvide]: {
      value: mockComponentData,
    },
  };

  const firstCellClick = async (wrapper: VueWrapper) => {
    const cell = wrapper.find('.app-date-time-picker-year-table__cell');
    await cell.trigger('click');
  };

  const createWrapper = (props = {}, provide = {}) =>
    mount(AppYearTable, {
      props: {
        currentDate: mockToday,
        ...props,
      },
      global: {
        provide: {
          ...componentDataProvideMock,
          ...provide,
        },
      },
    });

  beforeEach(() => vi.resetAllMocks());

  it('render the decade table', () => {
    const wrapper = createWrapper();
    const rows = wrapper.findAll('tr');
    expect(rows).toHaveLength(3);
  });

  it('correctly displays classes for the current year', () => {
    const wrapper = createWrapper();
    const currentYearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell--current-year'
    );
    expect(currentYearCell.exists()).toBe(true);
    expect(currentYearCell.text()).toBe('2025');
  });

  it('correctly displays classes for the selected year', () => {
    const selectedYear = new Date(2026, 0, 1);
    const wrapper = createWrapper({ value: selectedYear });
    const selectedYearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell--selected-year'
    );
    expect(selectedYearCell.exists()).toBe(true);
    expect(selectedYearCell.text()).toBe('2026');
  });

  it('correctly displays classes for an unavailable year', () => {
    mockComponentData.disabledDate.mockImplementation(
      (date: Date) => date.getFullYear() === 2028
    );
    const wrapper = createWrapper();
    const disabledYearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell--disabled'
    );
    expect(disabledYearCell.exists()).toBe(true);
    expect(disabledYearCell.text()).toBe('2028');
  });

  it('calls the ‘update’ event when selecting an available year', async () => {
    const wrapper = createWrapper();
    const yearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell:not(.app-date-time-picker-year-table__cell--disabled)'
    );
    await yearCell.trigger('click');

    expect(yearCell.text()).toBe('2020');
    expect(wrapper.emitted('update')).toBeTruthy();
    expect(wrapper.emitted('update')![0][0]).toEqual(new Date(2020, 0, 1));
  });

  it('does not trigger the ‘update’ event when selecting an unavailable year', async () => {
    mockComponentData.disabledDate.mockImplementation(
      (date: Date) => date.getFullYear() === 2025
    );
    const wrapper = createWrapper();
    const disabledYearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell--disabled'
    );
    await disabledYearCell.trigger('click');

    expect(wrapper.emitted('update')).toBeFalsy();
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

    const wrapper = createWrapper({}, provide);

    await firstCellClick(wrapper);

    expect(globalTableDataMock.select).not.toBeCalled();
  });

  it('must call the global selector function', async () => {
    mockComponentData.disabledDate.mockReturnValue(false);

    const wrapper = createWrapper({}, globalTableDataProvideMock);

    await firstCellClick(wrapper);

    expect(globalTableDataMock.select).toBeCalled();
    expect(globalTableDataMock.select.mock.calls[0][0]).toStrictEqual(
      new Date(2020, 0, 1)
    );
  });

  it('must call the local selector function', async () => {
    mockComponentData.disabledDate.mockReturnValue(false);

    const wrapper = createWrapper({}, yearTableDataProvideMock);

    await firstCellClick(wrapper);

    expect(yearTableDataMock.select).toBeCalled();
    expect(yearTableDataMock.select.mock.calls[0][0]).toStrictEqual(
      new Date(2020, 0, 1)
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
      ...yearTableDataProvideMock,
    };

    const wrapper = createWrapper({}, provide);

    await firstCellClick(wrapper);

    expect(yearTableDataMock.select).not.toBeCalled();
  });

  it('the date must be selected using the function received through the inject', () => {
    yearTableDataMock.isSelected.mockImplementation((date: Date) => {
      return isSameYear(date, new Date(2025, 3, 1));
    });

    const wrapper = createWrapper({}, yearTableDataProvideMock);

    const selectedYearCell = wrapper.find(
      '.app-date-time-picker-year-table__cell--selected-year'
    );

    expect(selectedYearCell.text()).toBe('2025');
  });

  const classNameInSelectedCellCase = [['left'], ['center'], ['right']];

  it.each(classNameInSelectedCellCase)(
    'must be a class of the selected year with the prefix: %i',
    position => {
      yearTableDataMock.isSelected.mockImplementation((date: Date) => {
        if (isSameYear(date, new Date(2020, 3, 1))) {
          return position;
        }

        return null;
      });

      const wrapper = createWrapper({}, yearTableDataProvideMock);

      const selectedYearCell = wrapper.find(
        `.app-date-time-picker-year-table__cell--selected-year--${position}`
      );

      expect(selectedYearCell.exists()).toBeTruthy();
    }
  );

  it('the cell is in the range', () => {
    yearTableDataMock.inRange.mockImplementation((date: Date) =>
      isSameYear(date, new Date(2020, 0, 1))
    );

    const wrapper = createWrapper({}, yearTableDataProvideMock);

    const cell = wrapper.find('.app-date-time-picker-year-table__cell');
    expect(
      cell.classes('app-date-time-picker-year-table__cell--in-range')
    ).toBeTruthy();
  });

  it('the cell must have the hover in range class', () => {
    yearTableDataMock.isHoverRange.mockImplementation((date: Date) =>
      isSameYear(date, new Date(2020, 0, 1))
    );

    const wrapper = createWrapper({}, yearTableDataProvideMock);

    const cell = wrapper.find('.app-date-time-picker-year-table__cell');
    expect(
      cell.classes('app-date-time-picker-year-table__cell--hover-range')
    ).toBeTruthy();
  });

  it('should pass the date as a hover', async () => {
    const wrapper = createWrapper({}, yearTableDataProvideMock);
    const cell = wrapper.find('.app-date-time-picker-year-table__cell');

    await cell.trigger('mouseenter');

    expect(yearTableDataMock.hover).toBeCalled();
    expect(yearTableDataMock.hover.mock.calls[0][0]).toStrictEqual(
      new Date(2020, 0, 1)
    );
  });

  it('should clear the date as hovered', async () => {
    const wrapper = createWrapper({}, yearTableDataProvideMock);
    const cell = wrapper.find('.app-date-time-picker-year-table__cell');

    await cell.trigger('mouseleave');

    expect(yearTableDataMock.resetHover).toBeCalled();
  });
});
