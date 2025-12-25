import { computed } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppYearTable from './AppYearTable.vue';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
  AppDateTimePickerYearTableComponentDataProvide,
} from '../../../const';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerGlobalTableComponentData,
  AppDateTimePickerYearTableComponentData,
} from '../../../interfaces/index.interface';
import { AppDateTimePickerMode } from '../../../enums/dateTimePickerMode';

describe('AppYearTable', () => {
  const createWrapper = (
    props?: Partial<InstanceType<typeof AppYearTable>['$props']>,
    provides?: {
      componentData?: Partial<AppDateTimePickerComponentData>;
      yearTableData?: Partial<AppDateTimePickerYearTableComponentData>;
      globalTableData?: Partial<AppDateTimePickerGlobalTableComponentData>;
    }
  ) => {
    const defaultComponentData: Partial<AppDateTimePickerComponentData> = {
      today: new Date('2023-06-15'),
      disabledDate: undefined,
      mode: AppDateTimePickerMode.Day,
      ...provides?.componentData,
    };

    return shallowMount(AppYearTable, {
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
          [AppDateTimePickerYearTableComponentDataProvide]:
            provides?.yearTableData || null,
          [AppDateTimePickerGlobalTableComponentDataProvide]:
            provides?.globalTableData || null,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Year rows generation', () => {
    it('should render 10 years in a decade starting from decade start', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      expect(cells).toHaveLength(10);
      expect(cells[0].text()).toBe('2020');
      expect(cells[9].text()).toBe('2029');
    });

    it('should render years in column rows', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const rows = wrapper.findAll('tr');

      expect(rows).toHaveLength(3);
      expect(rows[0].findAll('td')).toHaveLength(4);
      expect(rows[1].findAll('td')).toHaveLength(4);
      expect(rows[2].findAll('td')).toHaveLength(2);
    });

    it('should calculate decade for year 2005', () => {
      const wrapper = createWrapper({ currentDate: new Date('2005-03-20') });
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBe('2000');
      expect(cells[9].text()).toBe('2009');
    });

    it('should update years when currentDate prop changes', async () => {
      const wrapper = createWrapper({ currentDate: new Date('2020-01-01') });
      let cells = wrapper.findAll('td');
      expect(cells[0].text()).toBe('2020');

      await wrapper.setProps({ currentDate: new Date('2030-01-01') });
      cells = wrapper.findAll('td');
      expect(cells[0].text()).toBe('2030');
    });
  });

  describe('Year selection', () => {
    it('should emit update event when year is clicked', async () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('click');

      expect(wrapper.emitted('update')).toBeTruthy();
      expect(wrapper.emitted('update')?.[0][0]).toStrictEqual(
        new Date('2020-06-15')
      );
    });

    it('should emit correct date when year is selected', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: new Date('2023-06-15'),
      });
      const cellWith2022 = wrapper.findAll('td')[2];

      await cellWith2022.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getFullYear()).toBe(2022);
    });

    it('should not emit update event when disabled year is clicked', async () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('click');

      expect(wrapper.emitted('update')).toBeFalsy();
    });

    it('should call yearTableData select when provided', async () => {
      const selectFn = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        {
          yearTableData: { select: selectFn },
          componentData: { mode: AppDateTimePickerMode.Year },
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
  });

  describe('Disabled years', () => {
    it('should mark years as disabled based on disabledDate function', () => {
      const disabledDate = vi.fn((date: Date) => date.getFullYear() < 2022);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const cells = wrapper.findAll('td');

      expect(disabledDate).toHaveBeenCalled();
      expect(cells[0].classes()).toContain(
        'app-date-time-picker-year-table__cell--disabled'
      );
      expect(cells[3].classes()).not.toContain(
        'app-date-time-picker-year-table__cell--disabled'
      );
    });

    it('should not disable any years when disabledDate is not provided', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      const disabledCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-year-table__cell--disabled')
      );
      expect(disabledCells).toHaveLength(0);
    });
  });

  describe('Current year highlighting', () => {
    it('should mark current year based on today prop', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { today: new Date('2023-01-01') } }
      );
      const cells = wrapper.findAll('td');
      const cell2023 = cells[3];

      expect(cell2023.classes()).toContain(
        'app-date-time-picker-year-table__cell--current-year'
      );
    });

    it('should not mark any year as current when today is outside decade', () => {
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { today: new Date('2010-01-01') } }
      );
      const cells = wrapper.findAll('td');

      const currentYearCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-year-table__cell--current-year')
      );
      expect(currentYearCells).toHaveLength(0);
    });
  });

  describe('Selected year highlighting', () => {
    it('should mark selected year when value prop is provided', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: new Date('2022-03-10'),
      });
      const cells = wrapper.findAll('td');
      const cell2022 = cells[2];

      expect(cell2022.classes()).toContain(
        'app-date-time-picker-year-table__cell--selected-year'
      );
    });

    it('should use yearTableData isSelected when provided', () => {
      const isSelected = vi.fn((date: Date) => date.getFullYear() === 2024);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { yearTableData: { isSelected } }
      );
      const cells = wrapper.findAll('td');
      const cell2024 = cells[4];

      expect(isSelected).toHaveBeenCalled();
      expect(cell2024.classes()).toContain(
        'app-date-time-picker-year-table__cell--selected-year'
      );
    });

    it('should not mark any year as selected when value is null', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: null,
      });
      const cells = wrapper.findAll('td');

      const selectedCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-year-table__cell--selected-year')
      );
      expect(selectedCells).toHaveLength(0);
    });
  });

  describe('Range highlighting', () => {
    it('should mark years in range when inRange function is provided', () => {
      const inRange = vi.fn((date: Date) => {
        const year = date.getFullYear();
        return year >= 2021 && year <= 2023;
      });
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { yearTableData: { inRange } }
      );
      const cells = wrapper.findAll('td');

      expect(inRange).toHaveBeenCalled();
      expect(cells[1].classes()).toContain(
        'app-date-time-picker-year-table__cell--in-range'
      );
      expect(cells[2].classes()).toContain(
        'app-date-time-picker-year-table__cell--in-range'
      );
      expect(cells[3].classes()).toContain(
        'app-date-time-picker-year-table__cell--in-range'
      );
    });

    it('should not mark any year in range when inRange is not provided', () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const cells = wrapper.findAll('td');

      const rangeCells = cells.filter(cell =>
        cell
          .classes()
          .includes('app-date-time-picker-year-table__cell--in-range')
      );
      expect(rangeCells).toHaveLength(0);
    });
  });

  describe('Hover functionality', () => {
    it('should call hover function when mouse enters cell', async () => {
      const hover = vi.fn();
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { yearTableData: { hover } }
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
        { yearTableData: { resetHover } }
      );
      const firstCell = wrapper.findAll('td')[0];

      await firstCell.trigger('mouseleave');

      expect(resetHover).toHaveBeenCalled();
    });

    it('should mark years in hover range when isHoverRange is provided', () => {
      const isHoverRange = vi.fn((date: Date) => date.getFullYear() === 2025);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { yearTableData: { isHoverRange } }
      );
      const cells = wrapper.findAll('td');

      expect(isHoverRange).toHaveBeenCalled();
      expect(cells[5].classes()).toContain(
        'app-date-time-picker-year-table__cell--hover-range'
      );
    });

    it('should not call hover when yearTableData is not provided', async () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const firstCell = wrapper.findAll('td')[0];

      await expect(firstCell.trigger('mouseenter')).resolves.not.toThrow();
    });

    it('should not call resetHover when yearTableData is not provided', async () => {
      const wrapper = createWrapper({ currentDate: new Date('2023-06-15') });
      const firstCell = wrapper.findAll('td')[0];

      await expect(firstCell.trigger('mouseleave')).resolves.not.toThrow();
    });
  });

  describe('Year formatting', () => {
    it('should preserve month and day from value when setting year', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        value: new Date('2023-06-15T14:30:00'),
      });
      const cellWith2024 = wrapper.findAll('td')[4];

      await cellWith2024.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(5);
      expect(emittedDate.getDate()).toBe(15);
      expect(emittedDate.getHours()).toBe(14);
      expect(emittedDate.getMinutes()).toBe(30);
    });

    it('should use currentDate when value is null for year setting', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-08-20T10:00:00'),
        value: null,
      });
      const cellWith2025 = wrapper.findAll('td')[5];

      await cellWith2025.trigger('click');

      const emittedDate = wrapper.emitted('update')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(7);
      expect(emittedDate.getDate()).toBe(20);
    });
  });

  describe('Selected year position classes', () => {
    it('should add position class based on isSelected return value', () => {
      const isSelected = vi.fn((date: Date) => {
        if (date.getFullYear() === 2022) return 'left';
        if (date.getFullYear() === 2023) return 'center';
        if (date.getFullYear() === 2024) return 'right';
        return false;
      });
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { yearTableData: { isSelected } }
      );
      const cells = wrapper.findAll('td');

      expect(cells[2].classes()).toContain(
        'app-date-time-picker-year-table__cell--selected-year--left'
      );
      expect(cells[3].classes()).toContain(
        'app-date-time-picker-year-table__cell--selected-year--center'
      );
      expect(cells[4].classes()).toContain(
        'app-date-time-picker-year-table__cell--selected-year--right'
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle year 2000 correctly', () => {
      const wrapper = createWrapper({ currentDate: new Date('2000-01-01') });
      const cells = wrapper.findAll('td');

      expect(cells[0].text()).toBe('2000');
    });

    it('should handle year 1999 correctly', () => {
      const wrapper = createWrapper({ currentDate: new Date('1999-12-31') });
      const cells = wrapper.findAll('td');

      expect(cells[9].text()).toBe('1999');
    });

    it('should not throw when all inject values are null', () => {
      const wrapper = shallowMount(AppYearTable, {
        props: {
          currentDate: new Date('2023-06-15'),
        },
        global: {
          provide: {
            [AppDateTimePickerComponentDataProvide]: null,
            [AppDateTimePickerYearTableComponentDataProvide]: null,
            [AppDateTimePickerGlobalTableComponentDataProvide]: null,
          },
        },
      });

      expect(wrapper.findAll('td')).toHaveLength(10);
    });
  });
});
