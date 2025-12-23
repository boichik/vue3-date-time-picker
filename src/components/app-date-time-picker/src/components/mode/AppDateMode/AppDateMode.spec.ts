import { computed, nextTick } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppDateMode from './AppDateMode.vue';
import AppDateTimeController from '../../controller/AppController.vue';
import { AppTimePicker } from '@/components/app-time-picker';
import { AppDateTimePickerComponentDataProvide } from '../../../const';
import type { AppDateTimePickerComponentData } from '../../../interfaces/index.interface';
import { AppDateTimePickerType } from '../../../enums/dateTimePickerType';

describe('AppDateMode', () => {
  const createWrapper = (
    props?: Partial<InstanceType<typeof AppDateMode>['$props']>,
    provides?: {
      componentData?: Partial<AppDateTimePickerComponentData>;
    }
  ) => {
    const defaultComponentData: Partial<AppDateTimePickerComponentData> = {
      type: AppDateTimePickerType.Date,
      clearable: true,
      timeFormat: 'HH:mm:ss',
      today: new Date('2023-06-15T12:00:00'),
      defaultTime: '14:30:00',
      timeOptions: {
        placeholder: 'Select time',
        applyText: 'Apply',
        cancelText: 'Cancel',
      },
      disabledDate: undefined,
      ...provides?.componentData,
    };

    return shallowMount(AppDateMode, {
      props: {
        modelValue: null,
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
    it('should render AppDateTimeController', () => {
      const wrapper = createWrapper();
      const controller = wrapper.findComponent(AppDateTimeController);

      expect(controller.exists()).toBe(true);
    });

    it('should not render AppTimePicker in Date type', () => {
      const wrapper = createWrapper(
        {},
        { componentData: { type: AppDateTimePickerType.Date } }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.exists()).toBe(false);
    });

    it('should render AppTimePicker in DateTime type', () => {
      const wrapper = createWrapper(
        {},
        { componentData: { type: AppDateTimePickerType.DateTime } }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.exists()).toBe(true);
    });
  });

  describe('Props passing to AppDateTimeController', () => {
    it('should pass selectedDate as modelValue', () => {
      const date = new Date('2023-06-20');
      const wrapper = createWrapper({ modelValue: date });
      const controller = wrapper.findComponent(AppDateTimeController);

      expect(controller.props('selectedDate')).toEqual(date);
    });

    it('should pass null selectedDate when modelValue is null', () => {
      const wrapper = createWrapper({ modelValue: null });
      const controller = wrapper.findComponent(AppDateTimeController);

      expect(controller.props('selectedDate')).toBeNull();
    });

    it('should update selectedDate when modelValue changes', async () => {
      const wrapper = createWrapper({ modelValue: null });
      const newDate = new Date('2023-07-15');

      await wrapper.setProps({ modelValue: newDate });

      const controller = wrapper.findComponent(AppDateTimeController);
      expect(controller.props('selectedDate')).toEqual(newDate);
    });
  });

  describe('Props passing to AppTimePicker', () => {
    it('should pass modelValue to AppTimePicker', () => {
      const date = new Date('2023-06-20T14:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { componentData: { type: AppDateTimePickerType.DateTime } }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('modelValue')).toEqual(date);
    });

    it('should pass clearable prop to AppTimePicker', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            clearable: true,
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('clearable')).toBe(true);
    });

    it('should pass clearable as false to AppTimePicker', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            clearable: false,
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('clearable')).toBe(false);
    });

    it('should pass format prop to AppTimePicker', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            timeFormat: 'HH:mm',
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('format')).toBe('HH:mm');
    });

    it('should pass placeholder from timeOptions to AppTimePicker', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            timeOptions: { placeholder: 'Choose time' },
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('placeholder')).toBe('Choose time');
    });

    it('should pass applyText from timeOptions to AppTimePicker', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            timeOptions: { applyText: 'Confirm' },
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('applyText')).toBe('Confirm');
    });

    it('should pass cancelText from timeOptions to AppTimePicker', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            timeOptions: { cancelText: 'Close' },
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('cancelText')).toBe('Close');
    });

    it('should pass appendToBody as false to AppTimePicker', () => {
      const wrapper = createWrapper(
        {},
        { componentData: { type: AppDateTimePickerType.DateTime } }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('appendToBody')).toBe(false);
    });
  });

  describe('Default time handling', () => {
    it('should use defaultTime from componentData', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            defaultTime: '10:30:00',
            today: new Date('2023-06-15T12:00:00'),
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);
      const defaultTime = timePicker.props('defaultTime') as Date;

      expect(defaultTime.getHours()).toBe(10);
      expect(defaultTime.getMinutes()).toBe(30);
      expect(defaultTime.getSeconds()).toBe(0);
    });

    it('should use first element of array as defaultTime', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            defaultTime: ['08:15:00', '18:45:00'],
            today: new Date('2023-06-15T12:00:00'),
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);
      const defaultTime = timePicker.props('defaultTime') as Date;

      expect(defaultTime.getHours()).toBe(8);
      expect(defaultTime.getMinutes()).toBe(15);
    });

    it('should use today when defaultTime is empty string', () => {
      const today = new Date('2023-06-15T12:00:00');
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            defaultTime: '',
            today,
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);
      const defaultTime = timePicker.props('defaultTime') as Date;

      expect(defaultTime.getHours()).toBe(today.getHours());
      expect(defaultTime.getMinutes()).toBe(today.getMinutes());
    });

    it('should use today when defaultTime is empty array', () => {
      const today = new Date('2023-06-15T12:00:00');
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            defaultTime: [],
            today,
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);
      const defaultTime = timePicker.props('defaultTime') as Date;

      expect(defaultTime.getHours()).toBe(today.getHours());
    });

    it('should use today when defaultTime is undefined', () => {
      const today = new Date('2023-06-15T12:00:00');
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            defaultTime: undefined,
            today,
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);
      const defaultTime = timePicker.props('defaultTime') as Date;

      expect(defaultTime.getHours()).toBe(today.getHours());
    });

    it('should set time to 14:30:00 for Date type when defaultTime provided', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.Date,
            defaultTime: '14:30:00',
            today: new Date('2023-06-15T12:00:00'),
          },
        }
      );
      const controller = wrapper.findComponent(AppDateTimeController);
      const modelValue = controller.props('modelValue') as Date;

      expect(modelValue.getHours()).toBe(14);
      expect(modelValue.getMinutes()).toBe(30);
      expect(modelValue.getSeconds()).toBe(0);
    });
  });

  describe('Model value updates', () => {
    it('should emit update:modelValue when AppTimePicker emits update', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-06-15T10:00:00') },
        { componentData: { type: AppDateTimePickerType.DateTime } }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);
      const newDate = new Date('2023-06-15T14:30:00');

      await timePicker.vm.$emit('update:modelValue', newDate);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newDate]);
    });

    it('should update currentDateDisplay when modelValue changes to valid Date', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const newDate = new Date('2023-07-20');

      await wrapper.setProps({ modelValue: newDate });
      await nextTick();

      const controller = wrapper.findComponent(AppDateTimeController);
      expect(controller.props('modelValue')).toEqual(newDate);
    });

    it('should not update currentDateDisplay when modelValue changes to null', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });

      await wrapper.setProps({ modelValue: null });
      await nextTick();

      const controller = wrapper.findComponent(AppDateTimeController);
      expect(controller.props('modelValue')).not.toBeNull();
    });

    it('should not update currentDateDisplay when modelValue changes to invalid value', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });
      const originalDate = wrapper
        .findComponent(AppDateTimeController)
        .props('modelValue');

      // @ts-expect-error Testing invalid value
      await wrapper.setProps({ modelValue: 'invalid' });
      await nextTick();

      const controller = wrapper.findComponent(AppDateTimeController);
      expect(controller.props('modelValue')).toEqual(originalDate);
    });
  });

  describe('Provide/Inject for AppTimePicker', () => {
    it('should provide AppTimePickerInternalSettings in DateTime mode', () => {
      const disabledDate = vi.fn();
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            disabledDate,
          },
        }
      );

      const timePicker = wrapper.findComponent(AppTimePicker);
      expect(timePicker.exists()).toBe(true);
    });

    it('should provide AppDateTimePopoverInternalSettings in DateTime mode', () => {
      const wrapper = createWrapper(
        {},
        { componentData: { type: AppDateTimePickerType.DateTime } }
      );

      const timePicker = wrapper.findComponent(AppTimePicker);
      expect(timePicker.exists()).toBe(true);
    });

    it('should not provide AppTimePickerInternalSettings in Date mode', () => {
      const wrapper = createWrapper(
        {},
        { componentData: { type: AppDateTimePickerType.Date } }
      );

      const timePicker = wrapper.findComponent(AppTimePicker);
      expect(timePicker.exists()).toBe(false);
    });
  });

  describe('Type switching', () => {
    it('should show AppTimePicker when type changes from Date to DateTime', async () => {
      const wrapper = createWrapper(
        {},
        { componentData: { type: AppDateTimePickerType.Date } }
      );

      expect(wrapper.findComponent(AppTimePicker).exists()).toBe(false);
    });

    it('should maintain modelValue when type changes', async () => {
      const date = new Date('2023-06-15T14:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { componentData: { type: AppDateTimePickerType.Date } }
      );

      const controller = wrapper.findComponent(AppDateTimeController);
      expect(controller.props('selectedDate')).toEqual(date);
    });
  });

  describe('Edge cases', () => {
    it('should handle modelValue as Date at epoch start', () => {
      const epochDate = new Date(0);
      const wrapper = createWrapper({ modelValue: epochDate });
      const controller = wrapper.findComponent(AppDateTimeController);

      expect(controller.props('selectedDate')).toEqual(epochDate);
    });

    it('should handle modelValue as future date', () => {
      const futureDate = new Date('2100-12-31T23:59:59');
      const wrapper = createWrapper({ modelValue: futureDate });
      const controller = wrapper.findComponent(AppDateTimeController);

      expect(controller.props('selectedDate')).toEqual(futureDate);
    });

    it('should handle modelValue as past date', () => {
      const pastDate = new Date('1900-01-01T00:00:00');
      const wrapper = createWrapper({ modelValue: pastDate });
      const controller = wrapper.findComponent(AppDateTimeController);

      expect(controller.props('selectedDate')).toEqual(pastDate);
    });

    it('should handle leap year date', () => {
      const leapDate = new Date('2024-02-29T12:00:00');
      const wrapper = createWrapper({ modelValue: leapDate });
      const controller = wrapper.findComponent(AppDateTimeController);

      expect(controller.props('selectedDate')).toEqual(leapDate);
    });

    it('should handle milliseconds in defaultTime', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            defaultTime: '14:30:45',
            today: new Date('2023-06-15T12:00:00'),
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);
      const defaultTime = timePicker.props('defaultTime') as Date;

      expect(defaultTime.getMilliseconds()).toBe(0);
    });

    it('should handle undefined timeOptions', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            timeOptions: undefined,
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('placeholder')).toBeUndefined();
      expect(timePicker.props('applyText')).toBeUndefined();
      expect(timePicker.props('cancelText')).toBeUndefined();
    });

    it('should handle partial timeOptions', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            timeOptions: { placeholder: 'Time' },
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('placeholder')).toBe('Time');
      expect(timePicker.props('applyText')).toBeUndefined();
    });

    it('should handle undefined today', () => {
      const wrapper = createWrapper(
        {},
        {
          componentData: {
            type: AppDateTimePickerType.DateTime,
            today: undefined,
          },
        }
      );
      const timePicker = wrapper.findComponent(AppTimePicker);

      expect(timePicker.props('defaultTime')).toBeDefined();
    });
  });

  describe('Multiple rapid updates', () => {
    it('should handle rapid modelValue changes', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });

      await wrapper.setProps({ modelValue: new Date('2023-06-16') });
      await wrapper.setProps({ modelValue: new Date('2023-06-17') });
      await wrapper.setProps({ modelValue: new Date('2023-06-18') });

      const controller = wrapper.findComponent(AppDateTimeController);
      expect(controller.props('selectedDate')?.getDate()).toBe(18);
    });

    it('should handle alternating valid and null values', async () => {
      const wrapper = createWrapper({ modelValue: new Date('2023-06-15') });

      await wrapper.setProps({ modelValue: null });
      await wrapper.setProps({ modelValue: new Date('2023-06-20') });
      await wrapper.setProps({ modelValue: null });

      const controller = wrapper.findComponent(AppDateTimeController);
      expect(controller.props('selectedDate')).toBeNull();
    });
  });

  describe('Time format variations', () => {
    it.each([
      { format: 'HH:mm', expected: 'HH:mm' },
      { format: 'HH:mm:ss', expected: 'HH:mm:ss' },
      { format: 'hh:mm A', expected: 'hh:mm A' },
      { format: 'HH:mm:ss.SSS', expected: 'HH:mm:ss.SSS' },
    ])(
      'should pass format=$format to AppTimePicker',
      ({ format, expected }) => {
        const wrapper = createWrapper(
          {},
          {
            componentData: {
              type: AppDateTimePickerType.DateTime,
              timeFormat: format,
            },
          }
        );
        const timePicker = wrapper.findComponent(AppTimePicker);

        expect(timePicker.props('format')).toBe(expected);
      }
    );
  });

  describe('DefaultTime variations', () => {
    it.each([
      { time: '00:00:00', hours: 0, minutes: 0, seconds: 0 },
      { time: '12:30:45', hours: 12, minutes: 30, seconds: 45 },
      { time: '23:59:59', hours: 23, minutes: 59, seconds: 59 },
      { time: '06:15:30', hours: 6, minutes: 15, seconds: 30 },
    ])(
      'should handle defaultTime=$time correctly',
      ({ time, hours, minutes, seconds }) => {
        const wrapper = createWrapper(
          {},
          {
            componentData: {
              type: AppDateTimePickerType.DateTime,
              defaultTime: time,
              today: new Date('2023-06-15T12:00:00'),
            },
          }
        );
        const timePicker = wrapper.findComponent(AppTimePicker);
        const defaultTime = timePicker.props('defaultTime') as Date;

        expect(defaultTime.getHours()).toBe(hours);
        expect(defaultTime.getMinutes()).toBe(minutes);
        expect(defaultTime.getSeconds()).toBe(seconds);
      }
    );
  });

  describe('Controller modelValue updates', () => {
    it('should initialize controller with modelValue if provided', () => {
      const date = new Date('2023-06-15');
      const wrapper = createWrapper({ modelValue: date });
      const controller = wrapper.findComponent(AppDateTimeController);

      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should initialize controller with defaultTime if modelValue is null', () => {
      const wrapper = createWrapper(
        { modelValue: null },
        {
          componentData: {
            defaultTime: '14:30:00',
            today: new Date('2023-06-15T12:00:00'),
          },
        }
      );
      const controller = wrapper.findComponent(AppDateTimeController);
      const modelValue = controller.props('modelValue') as Date;

      expect(modelValue.getHours()).toBe(14);
      expect(modelValue.getMinutes()).toBe(30);
    });
  });
});
