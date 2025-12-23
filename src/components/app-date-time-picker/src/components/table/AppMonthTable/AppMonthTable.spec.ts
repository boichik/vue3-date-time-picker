import { computed } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppMonthTable from './AppMonthTable.vue';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
  AppDateTimePickerMonthTableComponentDataProvide,
} from '../../../const';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerGlobalTableComponentData,
  AppDateTimePickerMonthTableComponentData,
} from '../../../interfaces/index.interface';
import { AppDateTimePickerMode } from '../../../enums/dateTimePickerMode';

describe('AppMonthTable', () => {
  const createWrapper = (
    props?: Partial<InstanceType<typeof AppMonthTable>['$props']>,
    provides?: {
      componentData?: Partial<AppDateTimePickerComponentData>;
      monthTableData?: Partial<AppDateTimePickerMonthTableComponentData>;
      globalTableData?: Partial<AppDateTimePickerGlobalTableComponentData>;
    }
  ) => {
    const defaultComponentData: Partial<AppDateTimePickerComponentData> = {
      today: new Date('2023-06-15'),
      disabledDate: undefined,
      mode: AppDateTimePickerMode.Day,
      locale: 'en-US',
      monthCellFormat: 'short',
      ...provides?.componentData,
    };

    return shallowMount(AppMonthTable, {
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
          [AppDateTimePickerMonthTableComponentDataProvide]:
            provides?.monthTableData || null,
          [AppDateTimePickerGlobalTableComponentDataProvide]:
            provides?.globalTableData || null,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Month rows generation', () => {
    it('should render 12 months in total', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      expect(cells).toHaveLength(12);
    });

    it('should render months in 4-column rows', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const rows = wrapper.findAll('tr');

      expect(rows).toHaveLength(3);
      expect(rows[0].findAll('td')).toHaveLength(4);
      expect(rows[1].findAll('td')).toHaveLength(4);
      expect(rows[2].findAll('td')).toHaveLength(4);
    });

    it('should display months for current year from currentDate', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBe('Jan');
      expect(cells[11].text()).toBe('Dec');
    });

    it('should update months when currentDate year changes', async () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      let cells = wrapper.findAll('td');
      expect(cells[0].text()).toBe('Jan');

      await wrapper.setProps({ currentDate: new Date('2024-06-15') });
      cells = wrapper.findAll('td');
      expect(cells[0].text()).toBe('Jan');
    });
  });

  describe('Month formatting', () => {
    it('should format months with short format by default', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBe('Jan');
      expect(cells[1].text()).toBe('Feb');
      expect(cells[5].text()).toBe('Jun');
    });

    it('should format months with long format', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { monthCellFormat: 'long' } }
      );
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBe('January');
      expect(cells[1].text()).toBe('February');
    });

    it('should format months with narrow format', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { monthCellFormat: 'narrow' } }
      );
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBe('J');
      expect(cells[1].text()).toBe('F');
    });

    it('should format months according to locale', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { locale: 'uk-UA' } }
      );
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBeTruthy();
    });
  });

  describe('Month selection', () => {
    it('should emit update event when month is clicked', async () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('click');

      expect(wrapper.emitted('update')).toBeTruthy();
      expect(wrapper.emitted('update')?.[0][0]).toBeInstanceOf(Date);
    });

    it('should emit correct date when month is selected', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: new Date('2023-06-15'),
      });
      const marchCell = wrapper.findAll('td')[2];

      await marchCell.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(2);
      expect(emittedDate.getFullYear()).toBe(2023);
    });

    it('should preserve day and time when selecting month', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15T14:30:00'),
        value: new Date('2023-06-15T14:30:00'),
      });
      const januaryCell = wrapper.findAll('td')[0];

      await januaryCell.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getDate()).toBe(15);
      expect(emittedDate.getHours()).toBe(14);
      expect(emittedDate.getMinutes()).toBe(30);
    });

    it('should use currentDate when value is null', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-08-20T10:00:00'),
        value: null,
      });
      const mayCell = wrapper.findAll('td')[4];

      await mayCell.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(4);
      expect(emittedDate.getDate()).toBe(20);
    });

    it('should not emit update event when disabled month is clicked', async () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('click');

      expect(wrapper.emitted('update')).toBeFalsy();
    });

    it('should call monthTableData select when provided', async () => {
      const selectFn = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        {
          monthTableData: { select: selectFn },
          componentData: { mode: AppDateTimePickerMode.Month },
        }
      );
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('click');

      expect(selectFn).toHaveBeenCalled();
      expect(selectFn).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should call globalTableData select when mode is not Day', async () => {
      const selectFn = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        {
          globalTableData: { select: selectFn },
          componentData: { mode: AppDateTimePickerMode.Month },
        }
      );
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('click');

      expect(selectFn).toHaveBeenCalled();
    });

    it('should not call globalTableData select when mode is Day', async () => {
      const selectFn = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        {
          globalTableData: { select: selectFn },
          componentData: { mode: AppDateTimePickerMode.Day },
        }
      );
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('click');

      expect(selectFn).not.toHaveBeenCalled();
    });

    it('should handle year change when selecting month in different year', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2024-01-15'),
        value: new Date('2023-06-15'),
      });
      const marchCell = wrapper.findAll('td')[2];

      await marchCell.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(2);
      expect(emittedDate.getFullYear()).toBe(2024);
    });
  });

  describe('Disabled months', () => {
    it('should mark months as disabled based on disabledDate function', () => {
      const disabledDate = vi.fn((date: Date) => date.getMonth() < 3);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const cells = wrapper.findAll('td');

      expect(disabledDate).toHaveBeenCalled();
      expect(cells[0].classes()).toContain(
        'app-date-time-picker-month-table__cell--disabled'
      );
      expect(cells[1].classes()).toContain(
        'app-date-time-picker-month-table__cell--disabled'
      );
      expect(cells[2].classes()).toContain(
        'app-date-time-picker-month-table__cell--disabled'
      );
      expect(cells[3].classes()).not.toContain(
        'app-date-time-picker-month-table__cell--disabled'
      );
    });

    it('should not disable any months when disabledDate is not provided', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      const disabledCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-month-table__cell--disabled')
      );
      expect(disabledCells).toHaveLength(0);
    });
  });

  describe('Current month highlighting', () => {
    it('should mark current month based on today prop', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { today: new Date('2023-06-01') } }
      );
      const cells = wrapper.findAll('td');
      const juneCell = cells[5];

      expect(juneCell.classes()).toContain(
        'app-date-time-picker-month-table__cell--current-month'
      );
    });

    it('should not mark any month as current when today is in different year', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { today: new Date('2024-06-15') } }
      );
      const cells = wrapper.findAll('td');

      const currentMonthCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-month-table__cell--current-month')
      );
      expect(currentMonthCells).toHaveLength(0);
    });
  });

  describe('Selected month highlighting', () => {
    it('should mark selected month when value prop is provided', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: new Date('2023-03-10'),
      });
      const cells = wrapper.findAll('td');
      const marchCell = cells[2];

      expect(marchCell.classes()).toContain(
        'app-date-time-picker-month-table__cell--selected-month'
      );
    });

    it('should use monthTableData isSelected when provided', () => {
      const isSelected = vi.fn((date: Date) =>
        date.getMonth() === 4 ? 'center' : false
      );
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { monthTableData: { isSelected } }
      );
      const cells = wrapper.findAll('td');
      const mayCell = cells[4];

      expect(isSelected).toHaveBeenCalled();
      expect(mayCell.classes()).toContain(
        'app-date-time-picker-month-table__cell--selected-month'
      );
    });

    it('should not mark any month as selected when value is null', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: null,
      });
      const cells = wrapper.findAll('td');

      const selectedCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-month-table__cell--selected-month')
      );
      expect(selectedCells).toHaveLength(0);
    });

    it('should match month regardless of day', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: new Date('2023-06-01'),
      });
      const cells = wrapper.findAll('td');
      const juneCell = cells[5];

      expect(juneCell.classes()).toContain(
        'app-date-time-picker-month-table__cell--selected-month'
      );
    });
  });

  describe('Range highlighting', () => {
    it('should mark months in range when inRange function is provided', () => {
      const inRange = vi.fn((date: Date) => {
        const month = date.getMonth();
        return month >= 2 && month <= 5;
      });
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { monthTableData: { inRange } }
      );
      const cells = wrapper.findAll('td');

      expect(inRange).toHaveBeenCalled();
      expect(cells[2].classes()).toContain(
        'app-date-time-picker-month-table__cell--in-range'
      );
      expect(cells[3].classes()).toContain(
        'app-date-time-picker-month-table__cell--in-range'
      );
      expect(cells[4].classes()).toContain(
        'app-date-time-picker-month-table__cell--in-range'
      );
      expect(cells[5].classes()).toContain(
        'app-date-time-picker-month-table__cell--in-range'
      );
    });

    it('should not mark any month in range when inRange is not provided', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      const rangeCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-month-table__cell--in-range')
      );
      expect(rangeCells).toHaveLength(0);
    });
  });

  describe('Hover functionality', () => {
    it('should call hover function when mouse enters cell', async () => {
      const hover = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { monthTableData: { hover } }
      );
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('mouseenter');

      expect(hover).toHaveBeenCalled();
      expect(hover).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should call resetHover function when mouse leaves cell', async () => {
      const resetHover = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { monthTableData: { resetHover } }
      );
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('mouseleave');

      expect(resetHover).toHaveBeenCalled();
    });

    it('should mark months in hover range when isHoverRange is provided', () => {
      const isHoverRange = vi.fn((date: Date) => date.getMonth() === 7);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { monthTableData: { isHoverRange } }
      );
      const cells = wrapper.findAll('td');

      expect(isHoverRange).toHaveBeenCalled();
      expect(cells[7].classes()).toContain(
        'app-date-time-picker-month-table__cell--hover-range'
      );
    });

    it('should not call hover when monthTableData is not provided', async () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const firstCell = wrapper.findAll('td')[0];

      await expect(firstCell.trigger('mouseenter')).resolves.not.toThrow();
    });

    it('should not call resetHover when monthTableData is not provided', async () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const firstCell = wrapper.findAll('td')[0];

      await expect(firstCell.trigger('mouseleave')).resolves.not.toThrow();
    });
  });

  describe('Selected month position classes', () => {
    it('should add position class based on isSelected return value', () => {
      const isSelected = vi.fn((date: Date) => {
        const month = date.getMonth();
        if (month === 2) return 'left';
        if (month === 5) return 'center';
        if (month === 8) return 'right';
        return false;
      });
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { monthTableData: { isSelected } }
      );
      const cells = wrapper.findAll('td');

      expect(cells[2].classes()).toContain(
        'app-date-time-picker-month-table__cell--selected-month--left'
      );
      expect(cells[5].classes()).toContain(
        'app-date-time-picker-month-table__cell--selected-month--center'
      );
      expect(cells[8].classes()).toContain(
        'app-date-time-picker-month-table__cell--selected-month--right'
      );
    });
  });

  describe('Month order and indexing', () => {
    it('should have January as first month (index 0)', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBe('Jan');
    });

    it('should have December as last month (index 11)', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      expect(cells[11].text()).toBe('Dec');
    });

    it('should render months in correct order', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');
      const expectedOrder = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      cells.forEach((cell, index) => {
        expect(cell.text()).toBe(expectedOrder[index]);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle leap year February correctly', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2024-02-29'),
        value: new Date('2024-02-29'),
      });
      const januaryCell = wrapper.findAll('td')[0];

      await januaryCell.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(0);
    });

    it('should handle year boundaries when selecting January', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-12-31T23:59:59'),
        value: new Date('2023-12-31T23:59:59'),
      });
      const januaryCell = wrapper.findAll('td')[0];

      await januaryCell.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(0);
      expect(emittedDate.getFullYear()).toBe(2023);
    });

    it('should handle year boundaries when selecting December', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-01-01T00:00:00'),
        value: new Date('2023-01-01T00:00:00'),
      });
      const decemberCell = wrapper.findAll('td')[11];

      await decemberCell.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(11);
      expect(emittedDate.getFullYear()).toBe(2023);
    });

    it('should not throw when all inject values are null', () => {
      const wrapper = shallowMount(AppMonthTable, {
        props: {
          currentDate: new Date('2023-06-15'),
        },
        global: {
          provide: {
            [AppDateTimePickerComponentDataProvide]: null,
            [AppDateTimePickerMonthTableComponentDataProvide]: null,
            [AppDateTimePickerGlobalTableComponentDataProvide]: null,
          },
        },
      });

      expect(wrapper.findAll('td')).toHaveLength(12);
    });

    it('should preserve milliseconds when selecting month', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15T14:30:45.123'),
        value: new Date('2023-06-15T14:30:45.123'),
      });
      const marchCell = wrapper.findAll('td')[2];

      await marchCell.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getMilliseconds()).toBe(123);
    });
  });

  describe('Locale variations', () => {
    it('should render months in different locale', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { locale: 'fr-FR', monthCellFormat: 'short' } }
      );
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBeTruthy();
      expect(cells[0].text()).not.toBe('Jan');
    });

    it('should handle numeric month format', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { monthCellFormat: 'numeric' } }
      );
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBe('1');
      expect(cells[11].text()).toBe('12');
    });

    it('should handle 2-digit month format', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { monthCellFormat: '2-digit' } }
      );
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBe('01');
      expect(cells[11].text()).toBe('12');
    });
  });
});
