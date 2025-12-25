import { computed } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppController from './AppController.vue';
import AppDayTable from '../table/AppDayTable/AppDayTable.vue';
import AppMonthTable from '../table/AppMonthTable/AppMonthTable.vue';
import AppYearTable from '../table/AppYearTable/AppYearTable.vue';
import AppDateTimePanel from '../panel/AppDateTimePanel/AppDateTimePanel.vue';
import { AppDateTimePickerComponentDataProvide } from '../../const';
import type { AppDateTimePickerComponentData } from '../../interfaces/index.interface';
import { AppDateTimePickerMode } from '../../enums/dateTimePickerMode';

describe('AppController', () => {
  const createWrapper = (
    props?: Partial<InstanceType<typeof AppController>['$props']>,
    provides?: {
      componentData?: Partial<AppDateTimePickerComponentData>;
    }
  ) => {
    const defaultComponentData: Partial<AppDateTimePickerComponentData> = {
      mode: AppDateTimePickerMode.Day,
      ...provides?.componentData,
    };

    return shallowMount(AppController, {
      props: {
        modelValue: new Date('2023-06-15'),
        selectedDate: null,
        ...props,
      },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: computed(
            () => defaultComponentData
          ),
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component rendering', () => {
    it('should render AppDateTimePanel', () => {
      const wrapper = createWrapper();
      const panel = wrapper.findComponent(AppDateTimePanel);

      expect(panel.exists()).toBe(true);
    });

    it('should render AppDayTable when mode is Day', () => {
      const wrapper = createWrapper();
      const dayTable = wrapper.findComponent(AppDayTable);

      expect(dayTable.exists()).toBe(true);
    });

    it('should render AppMonthTable', () => {
      const wrapper = createWrapper();
      const monthTable = wrapper.findComponent(AppMonthTable);

      expect(monthTable.exists()).toBe(true);
    });

    it('should render AppYearTable', () => {
      const wrapper = createWrapper();
      const yearTable = wrapper.findComponent(AppYearTable);

      expect(yearTable.exists()).toBe(true);
    });
  });

  describe('Mode switching', () => {
    it('should display Day table by default', () => {
      const wrapper = createWrapper();
      const dayTable = wrapper.findComponent(AppDayTable);

      expect(dayTable.isVisible()).toBe(true);
    });

    it('should switch to Month table when mode changes to Month', async () => {
      const wrapper = createWrapper();
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('change-mode', AppDateTimePickerMode.Month);

      const monthTable = wrapper.findComponent(AppMonthTable);
      expect(monthTable.isVisible()).toBe(true);
    });

    it('should switch to Year table when mode changes to Year', async () => {
      const wrapper = createWrapper();
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('change-mode', AppDateTimePickerMode.Year);

      const yearTable = wrapper.findComponent(AppYearTable);
      expect(yearTable.isVisible()).toBe(true);
    });

    it('should hide Day table when mode is Month', async () => {
      const wrapper = createWrapper();
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('change-mode', AppDateTimePickerMode.Month);

      const dayTable = wrapper.findComponent(AppDayTable);
      expect(dayTable.isVisible()).toBe(false);
    });

    it('should sync mode with globalMode when provided', async () => {
      const wrapper = createWrapper(
        {},
        { componentData: { mode: AppDateTimePickerMode.Month } }
      );

      const monthTable = wrapper.findComponent(AppMonthTable);
      expect(monthTable.isVisible()).toBe(true);
    });
  });

  describe('Props passing to child components', () => {
    it('should pass currentDate (modelValue) to AppDateTimePanel', () => {
      const currentDate = new Date('2023-06-15');
      const wrapper = createWrapper({ modelValue: currentDate });
      const panel = wrapper.findComponent(AppDateTimePanel);

      expect(panel.props('currentDate')).toEqual(currentDate);
    });

    it('should pass selectedDate to AppDayTable', () => {
      const selectedDate = new Date('2023-07-20');
      const wrapper = createWrapper({ selectedDate });
      const dayTable = wrapper.findComponent(AppDayTable);

      expect(dayTable.props('value')).toEqual(selectedDate);
    });

    it('should pass currentDate to AppDayTable', () => {
      const currentDate = new Date('2023-06-15');
      const wrapper = createWrapper({ modelValue: currentDate });
      const dayTable = wrapper.findComponent(AppDayTable);

      expect(dayTable.props('currentDate')).toEqual(currentDate);
    });

    it('should pass selectedDate to AppMonthTable', () => {
      const selectedDate = new Date('2023-07-20');
      const wrapper = createWrapper({ selectedDate });
      const monthTable = wrapper.findComponent(AppMonthTable);

      expect(monthTable.props('value')).toEqual(selectedDate);
    });

    it('should pass currentDate to AppMonthTable', () => {
      const currentDate = new Date('2023-06-15');
      const wrapper = createWrapper({ modelValue: currentDate });
      const monthTable = wrapper.findComponent(AppMonthTable);

      expect(monthTable.props('currentDate')).toEqual(currentDate);
    });

    it('should pass selectedDate to AppYearTable', () => {
      const selectedDate = new Date('2023-07-20');
      const wrapper = createWrapper({ selectedDate });
      const yearTable = wrapper.findComponent(AppYearTable);

      expect(yearTable.props('value')).toEqual(selectedDate);
    });

    it('should pass currentDate to AppYearTable', () => {
      const currentDate = new Date('2023-06-15');
      const wrapper = createWrapper({ modelValue: currentDate });
      const yearTable = wrapper.findComponent(AppYearTable);

      expect(yearTable.props('currentDate')).toEqual(currentDate);
    });
  });

  describe('Navigation - Previous Month', () => {
    it('should emit update:modelValue when prevMonth is called', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('prev-month', 1);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should go back 1 month when prevMonth with value 1', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('prev-month', 1);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(4);
      expect(emittedDate.getFullYear()).toBe(2023);
    });

    it('should go back multiple months when prevMonth with value > 1', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('prev-month', 3);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(2);
    });

    it('should handle year boundary when going to previous month', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-01-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('prev-month', 1);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(11);
      expect(emittedDate.getFullYear()).toBe(2022);
    });
  });

  describe('Navigation - Next Month', () => {
    it('should emit update:modelValue when nextMonth is called', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-month', 1);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should go forward 1 month when nextMonth with value 1', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-month', 1);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(6);
      expect(emittedDate.getFullYear()).toBe(2023);
    });

    it('should go forward multiple months when nextMonth with value > 1', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-month', 3);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(8);
    });

    it('should handle year boundary when going to next month', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-12-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-month', 1);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(0);
      expect(emittedDate.getFullYear()).toBe(2024);
    });
  });

  describe('Navigation - Previous Year', () => {
    it('should emit update:modelValue when prevYear is called', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('prev-year', 1);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should go back 1 year when prevYear with value 1', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('prev-year', 1);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getFullYear()).toBe(2022);
      expect(emittedDate.getMonth()).toBe(5);
    });

    it('should go back multiple years when prevYear with value > 1', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('prev-year', 5);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getFullYear()).toBe(2018);
    });

    it('should preserve month and day when going to previous year', async () => {
      const wrapper = createWrapper({
        modelValue: new Date('2023-06-15T14:30:00'),
      });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('prev-year', 1);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(5);
      expect(emittedDate.getDate()).toBe(15);
      expect(emittedDate.getHours()).toBe(14);
    });
  });

  describe('Navigation - Next Year', () => {
    it('should emit update:modelValue when nextYear is called', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-year', 1);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should go forward 1 year when nextYear with value 1', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-year', 1);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getFullYear()).toBe(2024);
      expect(emittedDate.getMonth()).toBe(5);
    });

    it('should go forward multiple years when nextYear with value > 1', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-year', 10);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getFullYear()).toBe(2033);
    });

    it('should preserve month and day when going to next year', async () => {
      const wrapper = createWrapper({
        modelValue: new Date('2023-06-15T14:30:00'),
      });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-year', 1);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getMonth()).toBe(5);
      expect(emittedDate.getDate()).toBe(15);
      expect(emittedDate.getHours()).toBe(14);
    });
  });

  describe('Table update events', () => {
    it('should update modelValue when table emits update', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const dayTable = wrapper.findComponent(AppDayTable);
      const newDate = new Date('2023-07-20');

      await dayTable.vm.$emit('update', newDate);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(newDate);
    });

    it('should update modelValue from MonthTable', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const monthTable = wrapper.findComponent(AppMonthTable);
      const newDate = new Date('2023-08-15');

      await monthTable.vm.$emit('update', newDate);

      expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(newDate);
    });

    it('should update modelValue from YearTable', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const yearTable = wrapper.findComponent(AppYearTable);
      const newDate = new Date('2025-06-15');

      await yearTable.vm.$emit('update', newDate);

      expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(newDate);
    });
  });

  describe('Mode transitions after table updates', () => {
    it('should switch from Month to Day mode after month selection when globalMode is Day', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-06-15') },
        { componentData: { mode: AppDateTimePickerMode.Day } }
      );
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('change-mode', AppDateTimePickerMode.Month);

      const monthTable = wrapper.findComponent(AppMonthTable);
      await monthTable.vm.$emit('update', new Date('2023-08-15'));

      const dayTable = wrapper.findComponent(AppDayTable);
      expect(dayTable.isVisible()).toBe(true);
    });

    it('should switch from Year to Month mode after year selection when globalMode is not Year', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-06-15') },
        { componentData: { mode: AppDateTimePickerMode.Day } }
      );
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('change-mode', AppDateTimePickerMode.Year);

      const yearTable = wrapper.findComponent(AppYearTable);
      await yearTable.vm.$emit('update', new Date('2025-06-15'));

      const monthTable = wrapper.findComponent(AppMonthTable);
      expect(monthTable.isVisible()).toBe(true);
    });

    it('should not switch mode after year selection when globalMode is Year', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-06-15') },
        { componentData: { mode: AppDateTimePickerMode.Year } }
      );

      const yearTable = wrapper.findComponent(AppYearTable);
      await yearTable.vm.$emit('update', new Date('2025-06-15'));

      expect(yearTable.isVisible()).toBe(true);
    });

    it('should not switch mode after month selection when globalMode is Month', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-06-15') },
        { componentData: { mode: AppDateTimePickerMode.Month } }
      );

      const monthTable = wrapper.findComponent(AppMonthTable);
      await monthTable.vm.$emit('update', new Date('2023-08-15'));

      expect(monthTable.isVisible()).toBe(true);
    });
  });

  describe('Scroll handling', () => {
    it('should call panel handleSelectByScroll on wheel event', async () => {
      const wrapper = createWrapper();
      const handleSelectByScroll = vi.fn();
      const panel = wrapper.findComponent(AppDateTimePanel);

      panel.vm.handleSelectByScroll = handleSelectByScroll;

      const content = wrapper.find('div');
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
      await content.element.dispatchEvent(wheelEvent);

      expect(handleSelectByScroll).toHaveBeenCalled();
    });

    it('should prevent default on wheel event', async () => {
      const wrapper = createWrapper();
      const content = wrapper.find('div');
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
      const preventDefault = vi.spyOn(wheelEvent, 'preventDefault');

      await content.element.dispatchEvent(wheelEvent);

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe('Dynamic updates', () => {
    it('should update props when modelValue changes', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const newDate = new Date('2023-08-20');

      await wrapper.setProps({ modelValue: newDate });

      const dayTable = wrapper.findComponent(AppDayTable);
      expect(dayTable.props('currentDate')).toEqual(newDate);
    });

    it('should update props when selectedDate changes', async () => {
      const wrapper = createWrapper({ selectedDate: new Date('2023-06-15') });
      const newDate = new Date('2023-08-20');

      await wrapper.setProps({ selectedDate: newDate });

      const dayTable = wrapper.findComponent(AppDayTable);
      expect(dayTable.props('value')).toEqual(newDate);
    });
  });

  describe('Edge cases', () => {
    it('should handle null selectedDate', () => {
      const wrapper = createWrapper({ selectedDate: null });
      const dayTable = wrapper.findComponent(AppDayTable);

      expect(dayTable.props('value')).toBeNull();
    });

    it('should handle undefined selectedDate', () => {
      const wrapper = createWrapper({ selectedDate: undefined });
      const dayTable = wrapper.findComponent(AppDayTable);

      expect(dayTable.props('value')).toBeUndefined();
    });

    it('should handle leap year date navigation', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2024-02-29') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-year', 1);

      const emittedDate = wrapper.emitted('update:modelValue')?.[0][0] as Date;
      expect(emittedDate.getFullYear()).toBe(2025);
    });

    it('should pass mode prop to AppDateTimePanel', () => {
      const wrapper = createWrapper();
      const panel = wrapper.findComponent(AppDateTimePanel);

      expect(panel.props('mode')).toBe(AppDateTimePickerMode.Day);
    });

    it('should update mode in panel when internal mode changes', async () => {
      const wrapper = createWrapper();
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('change-mode', AppDateTimePickerMode.Month);

      expect(panel.props('mode')).toBe(AppDateTimePickerMode.Month);
    });
  });

  describe('Multiple rapid updates', () => {
    it('should handle multiple month navigations in sequence', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-month', 1);
      await panel.vm.$emit('next-month', 1);
      await panel.vm.$emit('next-month', 1);

      expect(wrapper.emitted('update:modelValue')).toHaveLength(3);
    });

    it('should handle multiple year navigations in sequence', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('next-year', 1);
      await panel.vm.$emit('prev-year', 1);

      expect(wrapper.emitted('update:modelValue')).toHaveLength(2);
    });

    it('should handle mode changes in sequence', async () => {
      const wrapper = createWrapper();
      const panel = wrapper.findComponent(AppDateTimePanel);

      await panel.vm.$emit('change-mode', AppDateTimePickerMode.Month);
      await panel.vm.$emit('change-mode', AppDateTimePickerMode.Year);
      await panel.vm.$emit('change-mode', AppDateTimePickerMode.Day);

      const dayTable = wrapper.findComponent(AppDayTable);
      expect(dayTable.isVisible()).toBe(true);
    });
  });
});
