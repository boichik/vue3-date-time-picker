import { computed } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppDateTimePanel from './AppDateTimePanel.vue';
import AppDateTimeControlButton from '../../base/AppDateTimeControlButton/AppDateTimeControlButton.vue';
import { AppDateTimePickerComponentDataProvide } from '../../../const';
import type { AppDateTimePickerComponentData } from '../../../interfaces/index.interface';
import { AppDateTimePickerMode } from '../../../enums/dateTimePickerMode';

describe('AppDateTimePanel', () => {
  const createWrapper = (
    props?: Partial<InstanceType<typeof AppDateTimePanel>['$props']>,
    provides?: {
      componentData?: Partial<AppDateTimePickerComponentData>;
    }
  ) => {
    const defaultComponentData: Partial<AppDateTimePickerComponentData> = {
      locale: 'en-US',
      monthButtonFormat: 'short',
      disabledDate: undefined,
      ...provides?.componentData,
    };

    return shallowMount(AppDateTimePanel, {
      props: {
        currentDate: new Date('2023-06-15'),
        mode: AppDateTimePickerMode.Day,
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
    it('should render all 4 control buttons', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);

      expect(buttons).toHaveLength(4);
    });

    it('should render year button', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text().includes('2023'));

      expect(yearButton).toBeTruthy();
    });

    it('should render month button in Day mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Jun');

      expect(monthButton?.isVisible()).toBe(true);
    });

    it('should not render month button in Year mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Jun');

      expect(monthButton?.isVisible()).toBe(false);
    });

    it('should not render month button in Month mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Month });
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Jun');

      expect(monthButton?.isVisible()).toBe(false);
    });
  });

  describe('Year button content', () => {
    it('should display current year in Day mode', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        mode: AppDateTimePickerMode.Day,
      });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2023');

      expect(yearButton?.isVisible()).toBe(true);
    });

    it('should display current year in Month mode', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        mode: AppDateTimePickerMode.Month,
      });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2023');

      expect(yearButton?.isVisible()).toBe(true);
    });

    it('should display decade range in Year mode', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        mode: AppDateTimePickerMode.Year,
      });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2020-2029');

      expect(yearButton?.isVisible()).toBe(true);
    });

    it.each([
      { year: 2020, expected: '2020-2029' },
      { year: 2029, expected: '2020-2029' },
      { year: 2030, expected: '2030-2039' },
      { year: 1995, expected: '1990-1999' },
      { year: 2000, expected: '2000-2009' },
      { year: 2010, expected: '2010-2019' },
    ])(
      'should display decade $expected for year $year',
      ({ year, expected }) => {
        const wrapper = createWrapper({
          currentDate: new Date(`${year}-06-15`),
          mode: AppDateTimePickerMode.Year,
        });
        const buttons = wrapper.findAll('button');
        const yearButton = buttons.find(btn => btn.text() === expected);

        expect(yearButton?.isVisible()).toBe(true);
      }
    );
  });

  describe('Month button content', () => {
    it('should display month in short format by default', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        mode: AppDateTimePickerMode.Day,
      });
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Jun');

      expect(monthButton?.isVisible()).toBe(true);
    });

    it('should display month in long format when specified', () => {
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-15'),
          mode: AppDateTimePickerMode.Day,
        },
        { componentData: { monthButtonFormat: 'long' } }
      );
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'June');

      expect(monthButton?.isVisible()).toBe(true);
    });

    it('should display month in narrow format when specified', () => {
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-15'),
          mode: AppDateTimePickerMode.Day,
        },
        { componentData: { monthButtonFormat: 'narrow' } }
      );
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'J');

      expect(monthButton?.isVisible()).toBe(true);
    });

    it('should display month in numeric format when specified', () => {
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-15'),
          mode: AppDateTimePickerMode.Day,
        },
        { componentData: { monthButtonFormat: 'numeric' } }
      );
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === '6');

      expect(monthButton?.isVisible()).toBe(true);
    });

    it('should display month in 2-digit format when specified', () => {
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-15'),
          mode: AppDateTimePickerMode.Day,
        },
        { componentData: { monthButtonFormat: '2-digit' } }
      );
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === '06');

      expect(monthButton?.isVisible()).toBe(true);
    });

    it.each([
      { month: 0, locale: 'en-US', format: 'short', expected: 'Jan' },
      { month: 11, locale: 'en-US', format: 'short', expected: 'Dec' },
      { month: 5, locale: 'uk-UA', format: 'short', expected: 'черв.' },
      { month: 5, locale: 'en-US', format: 'long', expected: 'June' },
      { month: 0, locale: 'uk-UA', format: 'long', expected: 'січень' },
    ])(
      'should format month=$month with locale=$locale and format=$format as $expected',
      ({ month, locale, format, expected }) => {
        const wrapper = createWrapper(
          {
            currentDate: new Date(2023, month, 15),
            mode: AppDateTimePickerMode.Day,
          },
          { componentData: { locale, monthButtonFormat: format as never } }
        );
        const buttons = wrapper.findAll('button');
        const monthButton = buttons.find(btn => btn.text() === expected);

        expect(monthButton?.isVisible()).toBe(true);
      }
    );
  });

  describe('Button states', () => {
    it('should enable year button in Day mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2023');

      expect(yearButton?.attributes('disabled')).toBeUndefined();
    });

    it('should enable month button in Day mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Jun');

      expect(monthButton?.attributes('disabled')).toBeUndefined();
    });

    it('should disable year button in Year mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text().includes('-'));

      expect(yearButton?.attributes('disabled')).toBeDefined();
    });

    it('should enable year button in Month mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Month });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2023');

      expect(yearButton?.attributes('disabled')).toBeUndefined();
    });
  });

  describe('Control button props', () => {
    it('should pass doubleArrow prop to prev year button', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevYearButton = buttons[0];

      expect(prevYearButton.props('doubleArrow')).toBe(true);
    });

    it('should not pass doubleArrow to prev month button', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevMonthButton = buttons[1];

      expect(prevMonthButton.props('doubleArrow')).toBeFalsy();
    });

    it('should pass isRightPosition to next month button', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextMonthButton = buttons[2];

      expect(nextMonthButton.props('isRightPosition')).toBe(true);
    });

    it('should pass isRightPosition to next year button', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextYearButton = buttons[3];

      expect(nextYearButton.props('isRightPosition')).toBe(true);
    });

    it('should pass doubleArrow to next year button', () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextYearButton = buttons[3];

      expect(nextYearButton.props('doubleArrow')).toBe(true);
    });
  });

  describe('Navigation events - Previous', () => {
    it('should emit prevYear with displacement 1 in Day mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevYearButton = buttons[0];

      await prevYearButton.trigger('click');

      expect(wrapper.emitted('prevYear')).toBeTruthy();
      expect(wrapper.emitted('prevYear')?.[0]).toEqual([1]);
    });

    it('should emit prevYear with displacement 10 in Year mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevYearButton = buttons[0];

      await prevYearButton.trigger('click');

      expect(wrapper.emitted('prevYear')?.[0]).toEqual([10]);
    });

    it('should emit prevYear with displacement 1 in Month mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Month });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevYearButton = buttons[0];

      await prevYearButton.trigger('click');

      expect(wrapper.emitted('prevYear')?.[0]).toEqual([1]);
    });

    it('should emit prevMonth with displacement 1 in Day mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevMonthButton = buttons[1];

      await prevMonthButton.trigger('click');

      expect(wrapper.emitted('prevMonth')).toBeTruthy();
      expect(wrapper.emitted('prevMonth')?.[0]).toEqual([1]);
    });

    it('should not render prev month button in Month mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Month });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);

      expect(buttons[1].isVisible()).toBe(false);
    });

    it('should not render prev month button in Year mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);

      expect(buttons[1].isVisible()).toBe(false);
    });
  });

  describe('Navigation events - Next', () => {
    it('should emit nextYear with displacement 1 in Day mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextYearButton = buttons[3];

      await nextYearButton.trigger('click');

      expect(wrapper.emitted('nextYear')).toBeTruthy();
      expect(wrapper.emitted('nextYear')?.[0]).toEqual([1]);
    });

    it('should emit nextYear with displacement 10 in Year mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextYearButton = buttons[3];

      await nextYearButton.trigger('click');

      expect(wrapper.emitted('nextYear')?.[0]).toEqual([10]);
    });

    it('should emit nextYear with displacement 1 in Month mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Month });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextYearButton = buttons[3];

      await nextYearButton.trigger('click');

      expect(wrapper.emitted('nextYear')?.[0]).toEqual([1]);
    });

    it('should emit nextMonth with displacement 1 in Day mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextMonthButton = buttons[2];

      await nextMonthButton.trigger('click');

      expect(wrapper.emitted('nextMonth')).toBeTruthy();
      expect(wrapper.emitted('nextMonth')?.[0]).toEqual([1]);
    });

    it('should not render next month button in Month mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Month });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);

      expect(buttons[2].isVisible()).toBe(false);
    });

    it('should not render next month button in Year mode', () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);

      expect(buttons[2].isVisible()).toBe(false);
    });
  });

  describe('Mode change events', () => {
    it('should emit changeMode with Year when year button clicked', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2023');

      await yearButton?.trigger('click');

      expect(wrapper.emitted('changeMode')).toBeTruthy();
      expect(wrapper.emitted('changeMode')?.[0]).toEqual([
        AppDateTimePickerMode.Year,
      ]);
    });

    it('should emit changeMode with Month when month button clicked', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Jun');

      await monthButton?.trigger('click');

      expect(wrapper.emitted('changeMode')).toBeTruthy();
      expect(wrapper.emitted('changeMode')?.[0]).toEqual([
        AppDateTimePickerMode.Month,
      ]);
    });

    it('should not emit changeMode when year button clicked in Year mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text().includes('-'));

      await yearButton?.trigger('click');

      expect(wrapper.emitted('changeMode')).toBeFalsy();
    });
  });

  describe('Disabled state with disabledDate function', () => {
    it('should disable prev year button when all dates in previous year are disabled', () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevYearButton = buttons[0];

      expect(prevYearButton.props('disabled')).toBe(true);
    });

    it('should enable prev year button when some dates in previous year are enabled', () => {
      const disabledDate = vi.fn(() => false);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevYearButton = buttons[0];

      expect(prevYearButton.props('disabled')).toBe(false);
    });

    it('should disable next year button when all dates in next year are disabled', () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextYearButton = buttons[3];

      expect(nextYearButton.props('disabled')).toBe(true);
    });

    it('should disable prev month button when all dates in previous month are disabled', () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-15'),
          mode: AppDateTimePickerMode.Day,
        },
        { componentData: { disabledDate } }
      );
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevMonthButton = buttons[1];

      expect(prevMonthButton.props('disabled')).toBe(true);
    });

    it('should disable next month button when all dates in next month are disabled', () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-15'),
          mode: AppDateTimePickerMode.Day,
        },
        { componentData: { disabledDate } }
      );
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextMonthButton = buttons[2];

      expect(nextMonthButton.props('disabled')).toBe(true);
    });

    it('should not emit prevYear when button is disabled', async () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevYearButton = buttons[0];

      await prevYearButton.trigger('click');

      expect(wrapper.emitted('prevYear')).toBeFalsy();
    });

    it('should not emit prevMonth when button is disabled', async () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-15'),
          mode: AppDateTimePickerMode.Day,
        },
        { componentData: { disabledDate } }
      );
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevMonthButton = buttons[1];

      await prevMonthButton.trigger('click');

      expect(wrapper.emitted('prevMonth')).toBeFalsy();
    });

    it('should not emit nextYear when button is disabled', async () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { currentDate: new Date('2023-06-15') },
        { componentData: { disabledDate } }
      );
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextYearButton = buttons[3];

      await nextYearButton.trigger('click');

      expect(wrapper.emitted('nextYear')).toBeFalsy();
    });

    it('should not emit nextMonth when button is disabled', async () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-15'),
          mode: AppDateTimePickerMode.Day,
        },
        { componentData: { disabledDate } }
      );
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextMonthButton = buttons[2];

      await nextMonthButton.trigger('click');

      expect(wrapper.emitted('nextMonth')).toBeFalsy();
    });
  });

  describe('Scroll handling', () => {
    it('should call handlePrevMonth on scroll up in Day mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const wheelEvent = new WheelEvent('wheel', { deltaY: -100 });

      wrapper.vm.handleSelectByScroll(wheelEvent);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('prevMonth')).toBeTruthy();
    });

    it('should call handleNextMonth on scroll down in Day mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });

      wrapper.vm.handleSelectByScroll(wheelEvent);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('nextMonth')).toBeTruthy();
    });

    it('should call handlePrevYear on scroll up in Year mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const wheelEvent = new WheelEvent('wheel', { deltaY: -100 });

      wrapper.vm.handleSelectByScroll(wheelEvent);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('prevYear')).toBeTruthy();
    });

    it('should call handleNextYear on scroll down in Year mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });

      wrapper.vm.handleSelectByScroll(wheelEvent);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('nextYear')).toBeTruthy();
    });

    it('should call handlePrevYear on scroll up in Month mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Month });
      const wheelEvent = new WheelEvent('wheel', { deltaY: -100 });

      wrapper.vm.handleSelectByScroll(wheelEvent);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('prevYear')).toBeTruthy();
    });

    it('should call handleNextYear on scroll down in Month mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Month });
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });

      wrapper.vm.handleSelectByScroll(wheelEvent);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('nextYear')).toBeTruthy();
    });

    it('should emit with correct displacement on scroll in Year mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Year });
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });

      wrapper.vm.handleSelectByScroll(wheelEvent);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('nextYear')?.[0]).toEqual([10]);
    });

    it('should not emit when disabled button is triggered by scroll', async () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { mode: AppDateTimePickerMode.Day },
        { componentData: { disabledDate } }
      );
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });

      wrapper.vm.handleSelectByScroll(wheelEvent);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('nextMonth')).toBeFalsy();
    });
  });

  describe('Dynamic updates', () => {
    it('should update year button content when currentDate changes', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        mode: AppDateTimePickerMode.Day,
      });

      await wrapper.setProps({ currentDate: new Date('2025-06-15') });

      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2025');
      expect(yearButton).toBeTruthy();
    });

    it('should update month button content when currentDate changes', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        mode: AppDateTimePickerMode.Day,
      });

      await wrapper.setProps({ currentDate: new Date('2023-12-15') });

      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Dec');
      expect(monthButton).toBeTruthy();
    });

    it('should update decade range when currentDate changes in Year mode', async () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-06-15'),
        mode: AppDateTimePickerMode.Year,
      });

      await wrapper.setProps({ currentDate: new Date('2035-06-15') });

      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2030-2039');
      expect(yearButton).toBeTruthy();
    });

    it('should update displacement when mode changes from Day to Year', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });

      await wrapper.setProps({ mode: AppDateTimePickerMode.Year });

      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const nextYearButton = buttons[3];
      await nextYearButton.trigger('click');

      expect(wrapper.emitted('nextYear')?.[0]).toEqual([10]);
    });

    it('should show month controls when switching to Day mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Month });

      await wrapper.setProps({ mode: AppDateTimePickerMode.Day });

      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      expect(buttons[1].isVisible()).toBe(true);
      expect(buttons[2].isVisible()).toBe(true);
    });

    it('should hide month controls when switching from Day to Month mode', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });

      await wrapper.setProps({ mode: AppDateTimePickerMode.Month });

      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      expect(buttons[1].isVisible()).toBe(false);
      expect(buttons[2].isVisible()).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle year boundary in decade calculation', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2000-01-01'),
        mode: AppDateTimePickerMode.Year,
      });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2000-2009');

      expect(yearButton).toBeTruthy();
    });

    it('should handle leap year dates', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2024-02-29'),
        mode: AppDateTimePickerMode.Day,
      });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2024');

      expect(yearButton).toBeTruthy();
    });

    it('should handle January month', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-01-15'),
        mode: AppDateTimePickerMode.Day,
      });
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Jan');

      expect(monthButton).toBeTruthy();
    });

    it('should handle December month', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2023-12-15'),
        mode: AppDateTimePickerMode.Day,
      });
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Dec');

      expect(monthButton).toBeTruthy();
    });

    it('should expose handleSelectByScroll method', () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.handleSelectByScroll).toBeDefined();
      expect(typeof wrapper.vm.handleSelectByScroll).toBe('function');
    });

    it('should handle different locales for month formatting', () => {
      const wrapper = createWrapper(
        {
          currentDate: new Date('2023-06-15'),
          mode: AppDateTimePickerMode.Day,
        },
        { componentData: { locale: 'de-DE', monthButtonFormat: 'long' } }
      );
      const buttons = wrapper.findAll('button');
      const monthButton = buttons.find(btn => btn.text() === 'Juni');

      expect(monthButton).toBeTruthy();
    });

    it('should handle far future dates', () => {
      const wrapper = createWrapper({
        currentDate: new Date('2100-06-15'),
        mode: AppDateTimePickerMode.Year,
      });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '2100-2109');

      expect(yearButton).toBeTruthy();
    });

    it('should handle past century dates', () => {
      const wrapper = createWrapper({
        currentDate: new Date('1950-06-15'),
        mode: AppDateTimePickerMode.Year,
      });
      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text() === '1950-1959');

      expect(yearButton).toBeTruthy();
    });
  });

  describe('Multiple rapid interactions', () => {
    it('should handle multiple prev year clicks', async () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevYearButton = buttons[0];

      await prevYearButton.trigger('click');
      await prevYearButton.trigger('click');
      await prevYearButton.trigger('click');

      expect(wrapper.emitted('prevYear')).toHaveLength(3);
    });

    it('should handle alternating prev and next clicks', async () => {
      const wrapper = createWrapper();
      const buttons = wrapper.findAllComponents(AppDateTimeControlButton);
      const prevYearButton = buttons[0];
      const nextYearButton = buttons[3];

      await prevYearButton.trigger('click');
      await nextYearButton.trigger('click');
      await prevYearButton.trigger('click');

      expect(wrapper.emitted('prevYear')).toHaveLength(2);
      expect(wrapper.emitted('nextYear')).toHaveLength(1);
    });

    it('should handle mode changes during navigation', async () => {
      const wrapper = createWrapper({ mode: AppDateTimePickerMode.Day });
      const controlButtons = wrapper.findAllComponents(
        AppDateTimeControlButton
      );
      const prevMonthButton = controlButtons[1];

      await prevMonthButton.trigger('click');
      await wrapper.setProps({ mode: AppDateTimePickerMode.Year });

      const buttons = wrapper.findAll('button');
      const yearButton = buttons.find(btn => btn.text().includes('-'));
      await yearButton?.trigger('click');

      expect(wrapper.emitted('prevMonth')).toHaveLength(1);
      expect(wrapper.emitted('changeMode')).toBeFalsy();
    });
  });
});
