import { shallowMount, flushPromises } from '@vue/test-utils';
import { defineComponent, inject, ref, computed, nextTick } from 'vue';
import AppDateRangeMode from './AppDateRangeMode.vue';
import { AppTimePicker } from '@/components/app-time-picker';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerDayTableComponentDataProvide,
  AppDateTimePickerMonthTableComponentDataProvide,
  AppDateTimePickerYearTableComponentDataProvide,
} from '../../../const';
import { AppDateTimePickerType } from '../../../enums/dateTimePickerType';
import { AppDateTimePickerMode } from '../../../enums/dateTimePickerMode';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerDayTableComponentData,
  AppDateTimePickerMonthTableComponentData,
  AppDateTimePickerYearTableComponentData,
} from '../../../interfaces/index.interface';

const mockIsFullyVisible = ref(true);

vi.mock('@/composables/useIsFullyVisibleRangeContent', () => ({
  useIsFullyVisibleRangeContent: () => ({
    isFullyVisible: mockIsFullyVisible,
  }),
}));

describe('AppDateRangeMode', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockIsFullyVisible.value = true;
  });

  let injectedDayTableData: AppDateTimePickerDayTableComponentData;
  let injectedMonthTableData: AppDateTimePickerMonthTableComponentData;
  let injectedYearTableData: AppDateTimePickerYearTableComponentData;

  const AppDateTimeController = defineComponent({
    // eslint-disable-next-line vue/require-prop-types
    props: ['modelValue', 'selectedDate'],
    setup() {
      injectedDayTableData = inject(
        AppDateTimePickerDayTableComponentDataProvide,
        null
      )!;
      injectedMonthTableData = inject(
        AppDateTimePickerMonthTableComponentDataProvide,
        null
      )!;
      injectedYearTableData = inject(
        AppDateTimePickerYearTableComponentDataProvide,
        null
      )!;

      return {};
    },
    template: '<div></div>',
  });

  const createWrapper = (
    props?: Partial<InstanceType<typeof AppDateRangeMode>['$props']>,
    componentDataOverrides?: Partial<AppDateTimePickerComponentData>
  ) => {
    const today = new Date('2024-06-15T12:00:00');
    const componentData = computed<Partial<AppDateTimePickerComponentData>>(
      () => ({
        type: AppDateTimePickerType.DateRange,
        mode: AppDateTimePickerMode.Day,
        today,
        timeFormat: 'HH:mm:ss',
        clearable: true,
        timeOptions: {
          startPlaceholder: 'Start Time',
          endPlaceholder: 'End Time',
          applyText: 'Apply',
          cancelText: 'Cancel',
          nextText: 'Next',
        },
        defaultTime: ['10:00:00', '18:00:00'],
        disabledDate: undefined,
        ...componentDataOverrides,
      })
    );

    return shallowMount(AppDateRangeMode, {
      props: {
        modelValue: undefined,
        ...props,
      },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: componentData,
        },
        stubs: {
          AppDateTimeController,
          AppTimePicker: true,
        },
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render two AppDateTimeController components', () => {
      const wrapper = createWrapper();
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers).toHaveLength(2);
    });

    it('should not render AppTimePicker when type is DateRange', () => {
      const wrapper = createWrapper();
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers).toHaveLength(0);
    });

    it('should render two AppTimePicker when type is DateTimeRange and isFullyVisible is true', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers).toHaveLength(2);
    });

    it('should render one AppTimePicker when type is DateTimeRange and isFullyVisible is false', () => {
      mockIsFullyVisible.value = false;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers).toHaveLength(2);
      expect(timePickers[0].isVisible()).toBe(true);
      expect(timePickers[1].isVisible()).toBe(false);
    });

    it('should hide second section when isFullyVisible is false', () => {
      mockIsFullyVisible.value = false;
      const wrapper = createWrapper();
      const sections = wrapper.findAll('.ui-date-time-range-mode__section');

      expect(sections[1].attributes('style')).toContain('display: none');
    });

    it('should show second section when isFullyVisible is true', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper();
      const sections = wrapper.findAll('.ui-date-time-range-mode__section');

      expect(sections[1].attributes('style')).toBeUndefined();
    });
  });

  describe('Props Passing to AppDateTimeController', () => {
    it('should pass selectedStartDate as selected-date to first controller', () => {
      const startDate = new Date('2024-06-10');
      const wrapper = createWrapper({ modelValue: [startDate, null] });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('selectedDate')).toEqual(startDate);
    });

    it('should pass selectedEndDate as selected-date to second controller', () => {
      const endDate = new Date('2024-06-20');
      const wrapper = createWrapper({ modelValue: [null, endDate] });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[1].props('selectedDate')).toEqual(endDate);
    });

    it('should pass startDateDisplay as v-model to first controller', async () => {
      const startDate = new Date('2024-06-10T10:00:00');
      const wrapper = createWrapper({ modelValue: [startDate, null] });
      await flushPromises();
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('modelValue')).toEqual(startDate);
    });

    it('should pass endDateDisplay as v-model to second controller', async () => {
      const endDate = new Date('2024-06-20T18:00:00');
      const wrapper = createWrapper({ modelValue: [null, endDate] });
      await flushPromises();
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[1].props('modelValue')).toBeDefined();
    });
  });

  describe('Props Passing to AppTimePicker', () => {
    it('should pass clearable prop to first time picker', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        clearable: false,
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('clearable')).toBe(false);
    });

    it('should pass format prop to time pickers', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        timeFormat: 'HH:mm',
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('format')).toBe('HH:mm');
      expect(timePickers[1].props('format')).toBe('HH:mm');
    });

    it('should pass startPlaceholder to first time picker', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        timeOptions: { startPlaceholder: 'Custom Start' },
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('placeholder')).toBe('Custom Start');
    });

    it('should pass endPlaceholder to second time picker', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        timeOptions: { endPlaceholder: 'Custom End' },
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[1].props('placeholder')).toBe('Custom End');
    });

    it('should pass applyText to time pickers', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        timeOptions: { applyText: 'Confirm' },
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('applyText')).toBe('Confirm');
      expect(timePickers[1].props('applyText')).toBe('Confirm');
    });

    it('should pass cancelText to time pickers', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        timeOptions: { cancelText: 'Dismiss' },
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('cancelText')).toBe('Dismiss');
      expect(timePickers[1].props('cancelText')).toBe('Dismiss');
    });

    it('should pass nextText to first time picker when isFullyVisible is false', () => {
      mockIsFullyVisible.value = false;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        timeOptions: { nextText: 'Continue' },
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('nextText')).toBe('Continue');
    });

    it('should pass appendToBody as false to time pickers', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('appendToBody')).toBe(false);
      expect(timePickers[1].props('appendToBody')).toBe(false);
    });

    it('should pass isRange as false when isFullyVisible is true', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('isRange')).toBe(false);
    });

    it('should pass isRange as true when isFullyVisible is false', () => {
      mockIsFullyVisible.value = false;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('isRange')).toBe(true);
    });

    it('should pass defaultTime as single date when isFullyVisible is true', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        defaultTime: ['09:00:00', '17:00:00'],
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('defaultTime')).toBeInstanceOf(Date);
      expect((timePickers[0].props('defaultTime') as Date).getHours()).toBe(9);
    });

    it('should pass defaultTime as array when isFullyVisible is false', () => {
      mockIsFullyVisible.value = false;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        defaultTime: ['09:00:00', '17:00:00'],
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(Array.isArray(timePickers[0].props('defaultTime'))).toBe(true);
      expect(timePickers[0].props('defaultTime')).toHaveLength(2);
    });

    it('should pass modelValue as single date when isFullyVisible is true', () => {
      mockIsFullyVisible.value = true;
      const startDate = new Date('2024-06-10');
      const wrapper = createWrapper(
        { modelValue: [startDate, null] },
        {
          type: AppDateTimePickerType.DateTimeRange,
        }
      );
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('modelValue')).toEqual(startDate);
    });

    it('should pass modelValue as array when isFullyVisible is false', () => {
      mockIsFullyVisible.value = false;
      const startDate = new Date('2024-06-10');
      const endDate = new Date('2024-06-20');
      const wrapper = createWrapper(
        { modelValue: [startDate, endDate] },
        {
          type: AppDateTimePickerType.DateTimeRange,
        }
      );
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(Array.isArray(timePickers[0].props('modelValue'))).toBe(true);
      expect(timePickers[0].props('modelValue')).toEqual([startDate, endDate]);
    });
  });

  describe('ModelValue Formatting and Parsing', () => {
    it('should parse modelValue array and set start date', () => {
      const startDate = new Date('2024-06-10');
      const wrapper = createWrapper({ modelValue: [startDate, null] });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('selectedDate')).toEqual(startDate);
    });

    it('should parse modelValue array and set end date', () => {
      const endDate = new Date('2024-06-20');
      const wrapper = createWrapper({ modelValue: [null, endDate] });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[1].props('selectedDate')).toEqual(endDate);
    });

    it('should handle empty modelValue', () => {
      const wrapper = createWrapper({ modelValue: [] });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('selectedDate')).toBeUndefined();
      expect(controllers[1].props('selectedDate')).toBeUndefined();
    });

    it('should handle null modelValue', () => {
      // @ts-expect-error - testing null props
      const wrapper = createWrapper({ modelValue: null });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('selectedDate')).toBeUndefined();
      expect(controllers[1].props('selectedDate')).toBeUndefined();
    });

    it('should handle undefined modelValue', () => {
      const wrapper = createWrapper();
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('selectedDate')).toBeUndefined();
      expect(controllers[1].props('selectedDate')).toBeUndefined();
    });

    it('should handle modelValue with both dates', () => {
      const startDate = new Date('2024-06-10');
      const endDate = new Date('2024-06-20');
      const wrapper = createWrapper({ modelValue: [startDate, endDate] });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('selectedDate')).toEqual(startDate);
      expect(controllers[1].props('selectedDate')).toEqual(endDate);
    });

    it('should ignore invalid dates in modelValue', () => {
      // @ts-expect-error - testing invalid props
      const wrapper = createWrapper({ modelValue: ['invalid', 'dates'] });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('selectedDate')).toBeUndefined();
      expect(controllers[1].props('selectedDate')).toBeUndefined();
    });

    it('should apply defaultTime to start date from first element of array', () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        {
          defaultTime: ['09:00:00', '17:00:00'],
        }
      );

      const controllers = wrapper.findAllComponents(AppDateTimeController);

      const selectedDate = controllers[0].props('modelValue');

      expect(selectedDate?.getHours()).toBe(9);
      expect(selectedDate?.getMinutes()).toBe(0);
    });

    it('should apply defaultTime to end date from second element of array', async () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        {
          defaultTime: ['09:00:00', '17:00:00'],
        }
      );
      const controllers = wrapper.findAllComponents(AppDateTimeController);
      const selectedDate = controllers[1].props('modelValue');

      expect(selectedDate.getHours()).toBe(17);
      expect(selectedDate.getMinutes()).toBe(0);
    });

    it('should use today time when defaultTime is not provided', () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        {
          defaultTime: undefined,
          today: new Date('2024-06-15T14:30:00'),
        }
      );
      const controllers = wrapper.findAllComponents(AppDateTimeController);
      const selectedDate = controllers[0].props('modelValue');

      expect(selectedDate.getHours()).toBe(14);
      expect(selectedDate.getMinutes()).toBe(30);
    });

    it('should use today time when defaultTime array element is missing', () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        {
          defaultTime: undefined,
          today: new Date('2024-06-15T14:30:00'),
        }
      );
      const controllers = wrapper.findAllComponents(AppDateTimeController);
      const selectedDate = controllers[1].props('modelValue');

      expect(selectedDate.getHours()).toBe(14);
      expect(selectedDate.getMinutes()).toBe(30);
    });

    it('should use the default time 0 when defaultTime has one element', () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        {
          defaultTime: ['08:00:00'],
          today: new Date('2024-06-15T14:30:00'),
        }
      );
      const controllers = wrapper.findAllComponents(AppDateTimeController);
      const selectedDate = controllers[1].props('modelValue');

      expect(selectedDate.getHours()).toBe(0);
      expect(selectedDate.getMinutes()).toBe(0);
    });
  });

  describe('ModelValue Update Events', () => {
    it('should emit update:model-value when both dates are selected', async () => {
      const wrapper = createWrapper();

      const startDate = new Date('2024-06-10');
      const endDate = new Date('2024-06-20');

      injectedDayTableData.select(startDate);

      expect(wrapper.emitted('update:model-value')).toBeFalsy();

      injectedDayTableData.select(endDate);

      await nextTick();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')![0]).toEqual([
        [new Date('2024-06-10 10:00:00'), new Date('2024-06-20 18:00:00')],
      ]);
    });

    it('should swap dates if end date is before start date', async () => {
      const wrapper = createWrapper();

      const startDate = new Date('2024-06-20');
      const endDate = new Date('2024-06-10');

      injectedDayTableData.select(startDate);
      injectedDayTableData.select(endDate);

      await nextTick();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')![0]).toEqual([
        [new Date('2024-06-10 18:00:00'), new Date('2024-06-20 10:00:00')],
      ]);
    });

    it('should not emit when only start date is selected', async () => {
      const wrapper = createWrapper();
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      await controllers[0].vm.$emit(
        'update:model-value',
        new Date('2024-06-10')
      );
      await flushPromises();

      expect(wrapper.emitted('update:model-value')).toBeFalsy();
    });

    it('should not emit when only end date is selected', async () => {
      const wrapper = createWrapper();
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      await controllers[1].vm.$emit(
        'update:model-value',
        new Date('2024-06-20')
      );
      await flushPromises();

      expect(wrapper.emitted('update:model-value')).toBeFalsy();
    });

    it('should handle time picker update with array value', async () => {
      mockIsFullyVisible.value = false;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      const startDate = new Date('2024-06-10T09:00:00');
      const endDate = new Date('2024-06-20T17:00:00');

      await timePickers[0].vm.$emit('update:model-value', [startDate, endDate]);
      await flushPromises();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')![0]).toEqual([
        [startDate, endDate],
      ]);
    });

    it('should handle time picker update with single value', async () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(
        { modelValue: [null, new Date('2024-06-20')] },
        {
          type: AppDateTimePickerType.DateTimeRange,
        }
      );
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      const startDate = new Date('2024-06-10T09:00:00');

      await timePickers[0].vm.$emit('update:model-value', startDate);
      await flushPromises();

      const controllers = wrapper.findAllComponents(AppDateTimeController);
      expect(controllers[0].props('selectedDate')).toEqual(startDate);
    });

    it('should handle time picker update with null value', async () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(
        { modelValue: [new Date('2024-06-10'), new Date('2024-06-20')] },
        {
          type: AppDateTimePickerType.DateTimeRange,
        }
      );
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      await timePickers[0].vm.$emit('update:model-value', null);
      await flushPromises();

      const controllers = wrapper.findAllComponents(AppDateTimeController);
      expect(controllers[0].props('selectedDate')).toBeUndefined();
    });
  });

  describe('Display Synchronization', () => {
    it('should adjust endDateDisplay when startDateDisplay moves forward and overlaps', async () => {
      const startDate = new Date('2024-06-10');
      const endDate = new Date('2024-06-15');
      const wrapper = createWrapper({ modelValue: [startDate, endDate] });
      await flushPromises();

      const controllers = wrapper.findAllComponents(AppDateTimeController);
      await controllers[0].vm.$emit(
        'update:model-value',
        new Date('2024-06-16')
      );
      await flushPromises();

      const endDisplay = controllers[1].props('modelValue');
      expect(endDisplay.getMonth()).toBeGreaterThan(
        new Date('2024-06-16').getMonth()
      );
    });

    it('should adjust startDateDisplay when endDateDisplay moves backward and overlaps', async () => {
      const startDate = new Date('2024-06-10');
      const endDate = new Date('2024-07-15');
      const wrapper = createWrapper({ modelValue: [startDate, endDate] });
      await flushPromises();

      const controllers = wrapper.findAllComponents(AppDateTimeController);
      await controllers[1].vm.$emit(
        'update:model-value',
        new Date('2024-06-09')
      );
      await flushPromises();

      const startDisplay = controllers[0].props('modelValue');
      expect(startDisplay.getMonth()).toBeLessThan(
        new Date('2024-06-09').getMonth()
      );
    });

    it('should maintain gap in Day mode', async () => {
      const startDate = new Date('2024-06-10');
      const endDate = new Date('2024-07-15');
      const wrapper = createWrapper(
        { modelValue: [startDate, endDate] },
        {
          mode: AppDateTimePickerMode.Day,
        }
      );
      await flushPromises();

      const controllers = wrapper.findAllComponents(AppDateTimeController);
      const startDisplay = controllers[0].props('modelValue');
      const endDisplay = controllers[1].props('modelValue');

      expect(
        endDisplay.getMonth() - startDisplay.getMonth()
      ).toBeGreaterThanOrEqual(1);
    });

    it('should maintain gap in Year mode with displacement of 10', async () => {
      const startDate = new Date('2024-06-10');
      const endDate = new Date('2035-06-15');
      const wrapper = createWrapper(
        { modelValue: [startDate, endDate] },
        {
          mode: AppDateTimePickerMode.Year,
        }
      );
      await flushPromises();

      const controllers = wrapper.findAllComponents(AppDateTimeController);
      const startDisplay = controllers[0].props('modelValue');
      const endDisplay = controllers[1].props('modelValue');

      expect(
        endDisplay.getFullYear() - startDisplay.getFullYear()
      ).toBeGreaterThanOrEqual(10);
    });

    it('should adjust when displays are same date', async () => {
      const sameDate = new Date('2024-06-10');
      const wrapper = createWrapper({ modelValue: [sameDate, sameDate] });
      await flushPromises();

      const controllers = wrapper.findAllComponents(AppDateTimeController);
      const startDisplay = controllers[0].props('modelValue');
      const endDisplay = controllers[1].props('modelValue');

      expect(endDisplay.getMonth()).toBeGreaterThan(startDisplay.getMonth());
    });
  });

  describe('Provided Functions - Test Helper Component', () => {
    const createWrapperWithHelper = (
      props?: Partial<InstanceType<typeof AppDateRangeMode>['$props']>,
      componentDataOverrides?: Partial<AppDateTimePickerComponentData>
    ) => {
      const wrapper = createWrapper(props, componentDataOverrides);

      return wrapper;
    };

    describe('DayTableData Functions', () => {
      it('should provide dayTableData to child components', () => {
        createWrapperWithHelper();

        expect(injectedDayTableData).toBeDefined();
        expect(typeof injectedDayTableData.select).toBe('function');
        expect(typeof injectedDayTableData.hover).toBe('function');
        expect(typeof injectedDayTableData.resetHover).toBe('function');
        expect(typeof injectedDayTableData.inRange).toBe('function');
        expect(typeof injectedDayTableData.isSelected).toBe('function');
        expect(typeof injectedDayTableData.isHoverRange).toBe('function');
      });

      it('should select start date on first call', async () => {
        const wrapper = createWrapperWithHelper();
        const date = new Date('2024-06-10');

        injectedDayTableData.select(date);

        await nextTick();

        const controllers = wrapper.findAllComponents(AppDateTimeController);
        expect(controllers[0].props('selectedDate')).toBeDefined();
        expect(controllers[0].props('selectedDate').getDate()).toBe(10);
      });

      it('should select end date on second call', async () => {
        const wrapper = createWrapperWithHelper();

        const startDate = new Date('2024-06-10');
        const endDate = new Date('2024-06-20');

        injectedDayTableData.select(startDate);
        await flushPromises();
        injectedDayTableData.select(endDate);
        await flushPromises();

        expect(wrapper.emitted('update:model-value')).toBeTruthy();
      });

      it('should reset dates on third call', async () => {
        const wrapper = createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        await flushPromises();
        injectedDayTableData.select(new Date('2024-06-20'));
        await flushPromises();
        injectedDayTableData.select(new Date('2024-06-15'));
        await flushPromises();

        const controllers = wrapper.findAllComponents(AppDateTimeController);
        expect(controllers[1].props('selectedDate')).toBeUndefined();
      });

      it('should swap dates if end is before start', async () => {
        const wrapper = createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-20'));
        await flushPromises();
        injectedDayTableData.select(new Date('2024-06-10'));
        await flushPromises();

        const emitted = wrapper.emitted('update:model-value')!;
        const payload = emitted[0]?.[0] as [Date, Date];
        expect(payload[0].getDate()).toBe(10);
        expect(payload[1].getDate()).toBe(20);
      });

      it('should set hover date when start is selected and end is not', () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.hover(new Date('2024-06-15'));

        expect(
          injectedDayTableData.isHoverRange(new Date('2024-06-12'), false)
        ).toBe(true);
      });

      it('should not set hover when no start date', () => {
        createWrapperWithHelper();

        injectedDayTableData.hover(new Date('2024-06-15'));

        expect(
          injectedDayTableData.isHoverRange(new Date('2024-06-12'), false)
        ).toBe(false);
      });

      it('should reset hover date', () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.hover(new Date('2024-06-15'));
        injectedDayTableData.resetHover();

        expect(
          injectedDayTableData.isHoverRange(new Date('2024-06-12'), false)
        ).toBe(false);
      });

      it('should return true for dates in selected range', async () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.select(new Date('2024-06-20'));

        await nextTick();

        expect(
          injectedDayTableData.inRange(new Date('2024-06-15'), false)
        ).toBe(true);
      });

      it('should return false for dates outside selected range', async () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.select(new Date('2024-06-20'));

        await nextTick();

        expect(
          injectedDayTableData.inRange(new Date('2024-06-25'), false)
        ).toBe(false);
      });

      it('should return false for inRange when isOtherMonth is true', async () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.select(new Date('2024-06-20'));

        await nextTick();

        expect(injectedDayTableData.inRange(new Date('2024-06-15'), true)).toBe(
          false
        );
      });

      it('should return left for start date in isSelected', async () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.select(new Date('2024-06-20'));

        await nextTick();

        expect(
          injectedDayTableData.isSelected(new Date('2024-06-10'), false)
        ).toBe('left');
      });

      it('should return right for end date in isSelected', async () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.select(new Date('2024-06-20'));

        await nextTick();

        expect(
          injectedDayTableData.isSelected(new Date('2024-06-20'), false)
        ).toBe('right');
      });

      it('should return false for date between start and end with hover', async () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.hover(new Date('2024-06-20'));

        expect(
          injectedDayTableData.isSelected(new Date('2024-06-15'), false)
        ).toBe(false);
      });

      it('should return false for isSelected when isOtherMonth is true', () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));

        expect(
          injectedDayTableData.isSelected(new Date('2024-06-10'), true)
        ).toBe(false);
      });

      it('should return true for dates in hover range forward', () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.hover(new Date('2024-06-20'));

        expect(
          injectedDayTableData.isHoverRange(new Date('2024-06-15'), false)
        ).toBe(true);
      });

      it('should return true for dates in hover range backward', () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-20'));
        injectedDayTableData.hover(new Date('2024-06-10'));

        expect(
          injectedDayTableData.isHoverRange(new Date('2024-06-15'), false)
        ).toBe(true);
      });

      it('should return false for isHoverRange when isOtherMonth is true', () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.hover(new Date('2024-06-20'));

        expect(
          injectedDayTableData.isHoverRange(new Date('2024-06-15'), true)
        ).toBe(false);
      });

      it('should clear hover on select when both dates are set', async () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.hover(new Date('2024-06-15'));
        await flushPromises();
        injectedDayTableData.select(new Date('2024-06-20'));
        await flushPromises();

        expect(
          injectedDayTableData.isHoverRange(new Date('2024-06-12'), false)
        ).toBe(false);
      });

      it('should handle hover with same date as start showing right position', () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-10'));
        injectedDayTableData.hover(new Date('2024-06-15'));

        expect(
          injectedDayTableData.isSelected(new Date('2024-06-10'), false)
        ).toBe('left');
      });

      it('should return right when hover is before start', async () => {
        createWrapperWithHelper();

        injectedDayTableData.select(new Date('2024-06-20'));

        injectedDayTableData.hover(new Date('2024-06-10'));

        await nextTick();

        expect(
          injectedDayTableData.isSelected(new Date('2024-06-20'), false)
        ).toBe('right');
      });
    });

    describe('MonthTableData Functions', () => {
      it('should provide monthTableData to child components', () => {
        createWrapperWithHelper();

        expect(injectedMonthTableData).toBeDefined();
        expect(typeof injectedMonthTableData.select).toBe('function');
        expect(typeof injectedMonthTableData.hover).toBe('function');
        expect(typeof injectedMonthTableData.resetHover).toBe('function');
        expect(typeof injectedMonthTableData.inRange).toBe('function');
        expect(typeof injectedMonthTableData.isSelected).toBe('function');
        expect(typeof injectedMonthTableData.isHoverRange).toBe('function');
      });

      it('should work with month-level dates for select', async () => {
        const wrapper = createWrapperWithHelper();
        const date = new Date('2024-06-01');

        injectedMonthTableData.select(date);

        await nextTick();

        const controllers = wrapper.findAllComponents(AppDateTimeController);
        expect(controllers[0].props('selectedDate')).toBeDefined();
      });

      it('should work with month-level dates for inRange', async () => {
        createWrapperWithHelper();

        injectedMonthTableData.select(new Date('2024-06-01'));
        await flushPromises();
        injectedMonthTableData.select(new Date('2024-08-01'));
        await flushPromises();

        expect(injectedMonthTableData.inRange(new Date('2024-07-01'))).toBe(
          true
        );
      });

      it('should work with month-level dates for isSelected', async () => {
        createWrapperWithHelper();

        injectedMonthTableData.select(new Date('2024-06-01'));
        await flushPromises();
        injectedMonthTableData.select(new Date('2024-08-01'));
        await flushPromises();

        expect(injectedMonthTableData.isSelected(new Date('2024-06-15'))).toBe(
          'left'
        );
      });

      it('should work with month-level dates for hover', () => {
        createWrapperWithHelper();

        injectedMonthTableData.select(new Date('2024-06-01'));
        injectedMonthTableData.hover(new Date('2024-08-01'));

        expect(
          injectedMonthTableData.isHoverRange(new Date('2024-07-01'))
        ).toBe(true);
      });
    });

    describe('YearTableData Functions', () => {
      it('should provide yearTableData to child components', () => {
        createWrapperWithHelper();

        expect(injectedYearTableData).toBeDefined();
        expect(typeof injectedYearTableData.select).toBe('function');
        expect(typeof injectedYearTableData.hover).toBe('function');
        expect(typeof injectedYearTableData.resetHover).toBe('function');
        expect(typeof injectedYearTableData.inRange).toBe('function');
        expect(typeof injectedYearTableData.isSelected).toBe('function');
        expect(typeof injectedYearTableData.isHoverRange).toBe('function');
      });

      it('should work with year-level dates for select', async () => {
        const wrapper = createWrapperWithHelper();
        const date = new Date('2024-01-01');

        injectedYearTableData.select(date);

        await nextTick();

        const controllers = wrapper.findAllComponents(AppDateTimeController);
        expect(controllers[0].props('selectedDate')).toBeDefined();
      });

      it('should work with year-level dates for inRange', async () => {
        createWrapperWithHelper();

        injectedYearTableData.select(new Date('2024-01-01'));
        await flushPromises();
        injectedYearTableData.select(new Date('2026-01-01'));
        await flushPromises();

        expect(injectedYearTableData.inRange(new Date('2025-01-01'))).toBe(
          true
        );
      });

      it('should work with year-level dates for isSelected', async () => {
        createWrapperWithHelper();

        injectedYearTableData.select(new Date('2024-01-01'));
        await flushPromises();
        injectedYearTableData.select(new Date('2026-01-01'));
        await flushPromises();

        expect(injectedYearTableData.isSelected(new Date('2024-06-15'))).toBe(
          'left'
        );
      });

      it('should work with year-level dates for hover', () => {
        createWrapperWithHelper();

        injectedYearTableData.select(new Date('2024-01-01'));
        injectedYearTableData.hover(new Date('2026-01-01'));

        expect(injectedYearTableData.isHoverRange(new Date('2025-01-01'))).toBe(
          true
        );
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle leap year dates', async () => {
      const wrapper = createWrapper();

      const controllers = wrapper.findAllComponents(AppDateTimeController);
      const leapDate = new Date('2024-02-29');

      injectedDayTableData.select(leapDate);

      await nextTick();

      expect(controllers[0].props('selectedDate')).toEqual(
        new Date('2024-02-29 10:00:00')
      );
    });

    it('should handle year boundary dates', async () => {
      const wrapper = createWrapper();

      const startDate = new Date('2023-12-31');
      const endDate = new Date('2024-01-01');

      injectedDayTableData.select(startDate);
      injectedDayTableData.select(endDate);

      await nextTick();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
    });

    it('should handle same start and end dates', async () => {
      const sameDate = new Date('2024-06-15');
      const wrapper = createWrapper();

      injectedDayTableData.select(sameDate);
      injectedDayTableData.select(sameDate);

      await nextTick();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
    });

    it('should handle very large date ranges', async () => {
      const wrapper = createWrapper();

      const startDate = new Date('2000-01-01');
      const endDate = new Date('2099-12-31');

      injectedDayTableData.select(startDate);
      injectedDayTableData.select(endDate);

      await nextTick();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
    });

    it('should handle invalid date objects gracefully', () => {
      const wrapper = createWrapper({
        modelValue: [new Date('invalid'), null],
      });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('selectedDate')).toStrictEqual(new Date(NaN));
    });

    it('should handle missing timeOptions gracefully', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        timeOptions: undefined,
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('placeholder')).toBeUndefined();
    });

    it('should handle mode change from Day to Year', async () => {
      const wrapper = createWrapper(
        { modelValue: [new Date('2024-06-10'), new Date('2024-07-10')] },
        {
          mode: AppDateTimePickerMode.Day,
        }
      );
      await flushPromises();

      const componentData = computed(() => ({
        type: AppDateTimePickerType.DateRange,
        mode: AppDateTimePickerMode.Year,
        today: new Date('2024-06-15T12:00:00'),
        timeFormat: 'HH:mm:ss',
        clearable: true,
        timeOptions: {},
        defaultTime: ['10:00:00', '18:00:00'],
      }));

      await wrapper.vm.$parent?.$forceUpdate();
      await flushPromises();

      const controllers = wrapper.findAllComponents(AppDateTimeController);
      expect(controllers).toHaveLength(2);
    });

    it('should handle empty defaultTime array', () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
        defaultTime: [],
      });
      const timePickers = wrapper.findAllComponents(AppTimePicker);

      expect(timePickers[0].props('defaultTime')).toBeDefined();
    });

    it('should handle null in modelValue array', () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const controllers = wrapper.findAllComponents(AppDateTimeController);

      expect(controllers[0].props('selectedDate')).toBeUndefined();
      expect(controllers[1].props('selectedDate')).toBeUndefined();
    });

    it('should handle switching from fully visible to not visible', async () => {
      mockIsFullyVisible.value = true;
      const wrapper = createWrapper(undefined, {
        type: AppDateTimePickerType.DateTimeRange,
      });

      let sections = wrapper.findAll('section');
      expect(sections).toHaveLength(2);
      expect(sections.every(sec => sec.isVisible())).toBe(true);

      mockIsFullyVisible.value = false;
      await nextTick();

      sections = wrapper.findAll('section');
      expect(sections).toHaveLength(2);
      expect(sections.every(sec => sec.isVisible())).toBe(false);
    });
  });
});
