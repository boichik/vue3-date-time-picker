import { computed } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppDayTable from './AppDayTable.vue';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerDayTableComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
} from '../../../const';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerDayTableComponentData,
  AppDateTimePickerGlobalTableComponentData,
} from '../../../interfaces/index.interface';

describe('AppDayTable', () => {
  const createWrapper = (
    props?: Partial<InstanceType<typeof AppDayTable>['$props']>,
    provides?: {
      componentData?: Partial<AppDateTimePickerComponentData>;
      dayTableData?: Partial<AppDateTimePickerDayTableComponentData>;
      globalTableData?: Partial<AppDateTimePickerGlobalTableComponentData>;
    }
  ) => {
    const defaultComponentData: Partial<AppDateTimePickerComponentData> = {
      today: new Date('2023-06-15'),
      disabledDate: undefined,
      firstDayOfWeek: 1,
      locale: 'en-US',
      weekdayFormat: 'short',
      hideOffsetDay: false,
      ...provides?.componentData,
    };

    return shallowMount(AppDayTable, {
      props: {
        currentDate: new Date('2023-06-15'),
        value: undefined,
        ...props,
      },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: computed(
            () => defaultComponentData
          ),
          [AppDateTimePickerDayTableComponentDataProvide]:
            provides?.dayTableData || null,
          [AppDateTimePickerGlobalTableComponentDataProvide]:
            provides?.globalTableData || null,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Calendar structure', () => {
    it('should render weekday headers', () => {
      const wrapper = createWrapper();
      const headers = wrapper.findAll('thead th');

      expect(headers).toHaveLength(7);
    });

    it('should render 6 rows of days (42 days total)', () => {
      const wrapper = createWrapper();
      const rows = wrapper.findAll('tbody tr');
      const cells = wrapper.findAll('tbody td');

      expect(rows).toHaveLength(6);
      expect(cells).toHaveLength(42);
    });

    it('should render correct days for June 2023', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('tbody td');

      const juneDays = cells.filter(cell => {
        const classes = cell.classes();
        return !classes.includes(
          'app-date-time-picker-day-table__cell--other-month'
        );
      });

      expect(juneDays).toHaveLength(30);
    });

    it('should include days from previous month', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-01') });
      const cells = wrapper.findAll('tbody td');

      const prevMonthDays = cells.filter(cell => {
        const classes = cell.classes();
        return classes.includes(
          'app-date-time-picker-day-table__cell--other-month'
        );
      });

      expect(prevMonthDays.length).toBeGreaterThan(0);
    });

    it('should include days from next month', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-30') });
      const cells = wrapper.findAll('tbody td');

      const nextMonthDays = cells.filter((cell, index) => {
        const classes = cell.classes();
        return (
          index > 30 &&
          classes.includes('app-date-time-picker-day-table__cell--other-month')
        );
      });

      expect(nextMonthDays.length).toBeGreaterThan(0);
    });
  });

  describe('Weekday headers', () => {
    it('should display weekdays starting from Monday by default', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const headers = wrapper.findAll('thead th');

      expect(headers[0].text()).toBe('Mon');
      expect(headers[6].text()).toBe('Sun');
    });

    it('should reorder weekdays when firstDayOfWeek is Monday (1)', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { firstDayOfWeek: 1 } }
      );
      const headers = wrapper.findAll('thead th');

      expect(headers[0].text()).toBe('Mon');
      expect(headers[6].text()).toBe('Sun');
    });

    it('should reorder weekdays when firstDayOfWeek is Wednesday (3)', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { firstDayOfWeek: 3 } }
      );
      const headers = wrapper.findAll('thead th');

      expect(headers[0].text()).toBe('Wed');
    });

    it('should format weekdays according to locale', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { locale: 'uk-UA' } }
      );
      const headers = wrapper.findAll('thead th');

      expect(headers[0].text()).toBeTruthy();
    });

    it('should format weekdays with long format', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { weekdayFormat: 'long' } }
      );
      const headers = wrapper.findAll('thead th');

      expect(headers[0].text()).toBe('Monday');
    });

    it('should format weekdays with narrow format', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { weekdayFormat: 'narrow' } }
      );
      const headers = wrapper.findAll('thead th');

      expect(headers[0].text()).toBe('M');
    });
  });

  describe('Date selection', () => {
    it('should call dayTableData select when day is clicked', async () => {
      const selectFn = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { dayTableData: { select: selectFn } }
      );
      const cells = wrapper.findAll('tbody td');
      const firstCurrentMonthDay = cells.find(
        cell =>
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      await firstCurrentMonthDay?.trigger('click');

      expect(selectFn).toHaveBeenCalled();
      expect(selectFn).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should call globalTableData select when day is clicked', async () => {
      const selectFn = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { globalTableData: { select: selectFn } }
      );
      const cells = wrapper.findAll('tbody td');
      const firstCurrentMonthDay = cells.find(
        cell =>
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      await firstCurrentMonthDay?.trigger('click');

      expect(selectFn).toHaveBeenCalled();
    });

    it('should not call select when disabled day is clicked', async () => {
      const selectFn = vi.fn();
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        {
          componentData: { disabledDate },
          dayTableData: { select: selectFn },
        }
      );
      const cells = wrapper.findAll('tbody td');

      await cells[0].trigger('click');

      expect(selectFn).not.toHaveBeenCalled();
    });

    it('should not call select when hideOffsetDay is true and other month day is clicked', async () => {
      const selectFn = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        {
          componentData: { hideOffsetDay: true },
          dayTableData: { select: selectFn },
        }
      );
      const cells = wrapper.findAll('tbody td');
      const otherMonthDay = cells.find(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--other-month')
      );

      await otherMonthDay?.trigger('click');

      expect(selectFn).not.toHaveBeenCalled();
    });
  });

  describe('Disabled dates', () => {
    it('should mark dates as disabled based on disabledDate function', () => {
      const disabledDate = vi.fn((date: Date) => date.getDate() < 10);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const cells = wrapper.findAll('tbody td');
      const disabledCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--disabled')
      );

      expect(disabledDate).toHaveBeenCalled();
      expect(disabledCells.length).toBeGreaterThan(0);
    });

    it('should not disable any dates when disabledDate is not provided', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('tbody td');
      const disabledCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--disabled')
      );

      expect(disabledCells).toHaveLength(0);
    });
  });

  describe('Current day highlighting', () => {
    it('should mark current day based on today prop', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { today: new Date('2023-06-15') } }
      );
      const cells = wrapper.findAll('tbody td');
      const currentDayCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--current-day')
      );

      expect(currentDayCells.length).toBe(1);
    });

    it('should not mark any day as current when today is in another month', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { today: new Date('2023-07-15') } }
      );
      const cells = wrapper.findAll('tbody td');
      const currentDayCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--current-day')
      );

      expect(currentDayCells).toHaveLength(0);
    });
  });

  describe('Selected date highlighting', () => {
    it('should mark selected date when value prop is provided', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: new Date('2023-06-15'),
      });
      const cells = wrapper.findAll('tbody td');
      const selectedCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--selected')
      );

      expect(selectedCells.length).toBeGreaterThan(0);
    });

    it('should use dayTableData isSelected when provided', () => {
      const isSelected = vi.fn((date: Date) => {
        return date.getDate() === 20 ? 'center' : null;
      });
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { dayTableData: { isSelected: isSelected as never } }
      );
      const cells = wrapper.findAll('tbody td');
      const selectedCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--selected')
      );

      expect(isSelected).toHaveBeenCalled();
      expect(selectedCells.length).toBeGreaterThan(0);
    });

    it('should not mark any day as selected when value is null', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: null,
      });
      const cells = wrapper.findAll('tbody td');
      const selectedCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--selected')
      );

      expect(selectedCells).toHaveLength(0);
    });

    it('should not mark other month days as selected when hideOffsetDay is true', () => {
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-01'),
          value: new Date('2023-05-31'),
        },
        { componentData: { hideOffsetDay: true } }
      );
      const cells = wrapper.findAll('tbody td');
      const selectedOtherMonth = cells.filter(
        cell =>
          cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--selected') &&
          cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      expect(selectedOtherMonth).toHaveLength(0);
    });
  });

  describe('Range highlighting', () => {
    it('should mark dates in range when inRange function is provided', () => {
      const inRange = vi.fn((date: Date) => {
        const day = date.getDate();
        return day >= 10 && day <= 20;
      });
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { dayTableData: { inRange } }
      );
      const cells = wrapper.findAll('tbody td');
      const rangeCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--in-range')
      );

      expect(inRange).toHaveBeenCalled();
      expect(rangeCells.length).toBeGreaterThan(0);
    });

    it('should not mark any date in range when inRange is not provided', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('tbody td');
      const rangeCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--in-range')
      );

      expect(rangeCells).toHaveLength(0);
    });

    it('should not mark other month days in range when hideOffsetDay is true', () => {
      const inRange = vi.fn(() => true);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        {
          componentData: { hideOffsetDay: true },
          dayTableData: { inRange },
        }
      );
      const cells = wrapper.findAll('tbody td');
      const otherMonthInRange = cells.filter(
        cell =>
          cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--in-range') &&
          cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      expect(otherMonthInRange).toHaveLength(0);
    });
  });

  describe('Hover functionality', () => {
    it('should call hover function when mouse enters cell', async () => {
      const hover = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { dayTableData: { hover } }
      );
      const cells = wrapper.findAll('tbody td');
      const firstCurrentMonthDay = cells.find(
        cell =>
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      await firstCurrentMonthDay?.trigger('mouseenter');

      expect(hover).toHaveBeenCalled();
      expect(hover).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should call resetHover function when mouse leaves cell', async () => {
      const resetHover = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { dayTableData: { resetHover } }
      );
      const cells = wrapper.findAll('tbody td');
      const firstCurrentMonthDay = cells.find(
        cell =>
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      await firstCurrentMonthDay?.trigger('mouseleave');

      expect(resetHover).toHaveBeenCalled();
    });

    it('should mark dates in hover range when isHoverRange is provided', () => {
      const isHoverRange = vi.fn((date: Date) => date.getDate() === 15);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { dayTableData: { isHoverRange } }
      );
      const cells = wrapper.findAll('tbody td');
      const hoverRangeCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--hover-range')
      );

      expect(isHoverRange).toHaveBeenCalled();
      expect(hoverRangeCells.length).toBeGreaterThan(0);
    });

    it('should not call hover when hideOffsetDay is true and other month day is hovered', async () => {
      const hover = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        {
          componentData: { hideOffsetDay: true },
          dayTableData: { hover },
        }
      );
      const cells = wrapper.findAll('tbody td');
      const otherMonthDay = cells.find(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--other-month')
      );

      await otherMonthDay?.trigger('mouseenter');

      expect(hover).not.toHaveBeenCalled();
    });

    it('should not call resetHover when hideOffsetDay is true and other month day is unhovered', async () => {
      const resetHover = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        {
          componentData: { hideOffsetDay: true },
          dayTableData: { resetHover },
        }
      );
      const cells = wrapper.findAll('tbody td');
      const otherMonthDay = cells.find(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--other-month')
      );

      await otherMonthDay?.trigger('mouseleave');

      expect(resetHover).not.toHaveBeenCalled();
    });
  });

  describe('Hide offset days', () => {
    it('should hide other month days when hideOffsetDay is true', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { hideOffsetDay: true } }
      );
      const cells = wrapper.findAll('tbody td');
      const hiddenCells = cells.filter(cell =>
        cell.classes().includes('app-date-time-picker-day-table__cell--hide')
      );

      expect(hiddenCells.length).toBeGreaterThan(0);
    });

    it('should not hide other month days when hideOffsetDay is false', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { hideOffsetDay: false } }
      );
      const cells = wrapper.findAll('tbody td');
      const hiddenCells = cells.filter(cell =>
        cell.classes().includes('app-date-time-picker-day-table__cell--hide')
      );

      expect(hiddenCells).toHaveLength(0);
    });
  });

  describe('Selected position classes', () => {
    it('should add position class based on isSelected return value', () => {
      const isSelected = vi.fn((date: Date) => {
        const day = date.getDate();
        if (day === 10) return 'left';
        if (day === 15) return 'center';
        if (day === 20) return 'right';
        return null;
      });
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { dayTableData: { isSelected: isSelected as never } }
      );
      const cells = wrapper.findAll('tbody td');

      const leftCell = cells.find(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--selected-left')
      );
      const centerCell = cells.find(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--selected-center')
      );
      const rightCell = cells.find(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-day-table__cell--selected-right')
      );

      expect(leftCell?.exists()).toBe(true);
      expect(centerCell?.exists()).toBe(true);
      expect(rightCell?.exists()).toBe(true);
    });
  });

  describe('Calendar regeneration', () => {
    it('should regenerate calendar when currentDate changes', async () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      let cells = wrapper.findAll('tbody td');
      const juneDays = cells.filter(
        cell =>
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );
      expect(juneDays).toHaveLength(30);

      await wrapper.setProps({ currentDate: new Date('2023-07-15') });
      cells = wrapper.findAll('tbody td');
      const julyDays = cells.filter(
        cell =>
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );
      expect(julyDays).toHaveLength(31);
    });
  });

  describe('Edge cases', () => {
    it('should handle month with 31 days', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-01-15') });
      const cells = wrapper.findAll('tbody td');
      const januaryDays = cells.filter(
        cell =>
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      expect(januaryDays).toHaveLength(31);
    });

    it('should handle February in non-leap year', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-02-15') });
      const cells = wrapper.findAll('tbody td');
      const februaryDays = cells.filter(
        cell =>
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      expect(februaryDays).toHaveLength(28);
    });

    it('should handle February in leap year', () => {
      const wrapper = createWrapper({ currentDate: new Date('2024-02-15') });
      const cells = wrapper.findAll('tbody td');
      const februaryDays = cells.filter(
        cell =>
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      expect(februaryDays).toHaveLength(29);
    });

    it('should not throw when all inject values are null', () => {
      const wrapper = shallowMount(AppDayTable, {
        props: {
          currentDate: new Date('2023-06-15'),
        },
        global: {
          provide: {
            [AppDateTimePickerComponentDataProvide]: null,
            [AppDateTimePickerDayTableComponentDataProvide]: null,
            [AppDateTimePickerGlobalTableComponentDataProvide]: null,
          },
        },
      });

      expect(wrapper.findAll('tbody td')).toHaveLength(42);
    });

    it('should handle selecting first day of month', async () => {
      const selectFn = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-01') },
        { dayTableData: { select: selectFn } }
      );
      const cells = wrapper.findAll('tbody td');
      const firstDay = cells.find(
        cell =>
          cell.text() === '1' &&
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      await firstDay?.trigger('click');

      expect(selectFn).toHaveBeenCalled();
    });

    it('should handle selecting last day of month', async () => {
      const selectFn = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-30') },
        { dayTableData: { select: selectFn } }
      );
      const cells = wrapper.findAll('tbody td');
      const lastDay = cells.find(
        cell =>
          cell.text() === '30' &&
          !cell
            .classes()
            .includes('app-date-time-picker-day-table__cell--other-month')
      );

      await lastDay?.trigger('click');

      expect(selectFn).toHaveBeenCalled();
    });
  });
});
