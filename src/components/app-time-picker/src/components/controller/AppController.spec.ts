import { nextTick, ref, type Ref } from 'vue';
import { AppTimePickerComponentDataProvide } from '../../const';
import { shallowMount } from '@vue/test-utils';
import AppController from './AppController.vue';
import type { AppTimePickerComponentData } from '../../interfaces/index.interface';
import { AppTimeBarType } from '../../enums/timeBarType';

type InternalComponentData = Partial<AppTimePickerComponentData>;

const defaultAppTimePickerComponentData: InternalComponentData = {
  disabled: false,
  readonly: false,
  format: 'HH:mm:ss',
  isRange: false,
};

describe('AppController', () => {
  let mockAppTimePickerComponentData: Ref<InternalComponentData>;

  const createWrapper = (
    props?: Partial<InstanceType<typeof AppController>['$props']>,
    providedData?: InternalComponentData
  ) => {
    const mergedData = {
      ...mockAppTimePickerComponentData.value,
      ...providedData,
    };

    mockAppTimePickerComponentData.value = mergedData;

    return shallowMount(AppController, {
      props: {
        modelValue: null,
        selectableRange: undefined,
        ...props,
      },
      global: {
        provide: {
          [AppTimePickerComponentDataProvide]: mockAppTimePickerComponentData,
        },
        stubs: {
          AppTimeBar: {
            name: 'AppTimeBar',
            template: '<span></span>',
            props: ['modelValue', 'disabledValue', 'type', 'enabledAmPm'],
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAppTimePickerComponentData = ref({
      ...defaultAppTimePickerComponentData,
    });
  });

  describe('Component Rendering', () => {
    it('should render hours, minutes, seconds for HH:mm:ss format', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm:ss' });
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });
      expect(timeBars).toHaveLength(3);
    });

    it('should render only hours for HH format', () => {
      const wrapper = createWrapper({}, { format: 'HH' });
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });
      expect(timeBars).toHaveLength(1);
    });

    it('should render hours and minutes for HH:mm format', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm' });
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });
      expect(timeBars).toHaveLength(2);
    });

    it('should render hours with AM/PM for h:mm:ss a format', () => {
      const wrapper = createWrapper({}, { format: 'h:mm:ss a' });
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });
      expect(timeBars).toHaveLength(4);
    });

    it('should render only minutes for mm format', () => {
      const wrapper = createWrapper({}, { format: 'mm' });
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });
      expect(timeBars).toHaveLength(1);
    });

    it('should render only seconds for ss format', () => {
      const wrapper = createWrapper({}, { format: 'ss' });
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });
      expect(timeBars).toHaveLength(1);
    });

    it('should render separators between time components', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm:ss' });
      const separators = wrapper.findAll('div');
      expect(separators).toHaveLength(2);
    });

    it('should not render separator if only hours are shown', () => {
      const wrapper = createWrapper({}, { format: 'HH' });
      const separators = wrapper.findAll('div');
      expect(separators).toHaveLength(0);
    });

    it('should render one separator for HH:mm format', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm' });
      const separators = wrapper.findAll('div');
      expect(separators).toHaveLength(1);
    });
  });

  describe('ModelValue handling', () => {
    it('should handle null modelValue', () => {
      const wrapper = createWrapper({ modelValue: null });
      expect(wrapper.props('modelValue')).toBeNull();
    });

    it('should handle Date modelValue', () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper({ modelValue: date });
      expect(wrapper.props('modelValue')).toEqual(date);
    });

    it('should pass hours value to hours AppTimeBar', () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(14);
    });

    it('should pass minutes value to minutes AppTimeBar', () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const minuteBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[1];
      expect(minuteBar.props('modelValue')).toBe(30);
    });

    it('should pass seconds value to seconds AppTimeBar', () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const secondBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[2];
      expect(secondBar.props('modelValue')).toBe(45);
    });

    it('should use 0 for hours when modelValue is null', () => {
      const wrapper = createWrapper({ modelValue: null }, { format: 'HH:mm' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(0);
    });

    it('should use 0 for minutes when modelValue is null', () => {
      const wrapper = createWrapper({ modelValue: null }, { format: 'HH:mm' });
      const minuteBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[1];
      expect(minuteBar.props('modelValue')).toBe(0);
    });

    it('should use 0 for seconds when modelValue is null', () => {
      const wrapper = createWrapper(
        { modelValue: null },
        { format: 'HH:mm:ss' }
      );
      const secondBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[2];
      expect(secondBar.props('modelValue')).toBe(0);
    });
  });

  describe('Update events from AppTimeBar', () => {
    it('should emit update:model-value when hours change', async () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      await hourBar.vm.$emit('update:model-value', 16);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(16);
      expect(emittedDate.getMinutes()).toBe(30);
      expect(emittedDate.getSeconds()).toBe(45);
    });

    it('should emit update:model-value when minutes change', async () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const minuteBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[1];

      await minuteBar.vm.$emit('update:model-value', 45);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(14);
      expect(emittedDate.getMinutes()).toBe(45);
      expect(emittedDate.getSeconds()).toBe(45);
    });

    it('should emit update:model-value when seconds change', async () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const secondBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[2];

      await secondBar.vm.$emit('update:model-value', 30);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(14);
      expect(emittedDate.getMinutes()).toBe(30);
      expect(emittedDate.getSeconds()).toBe(30);
    });

    it('should handle multiple hour changes', async () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      await hourBar.vm.$emit('update:model-value', 10);
      await hourBar.vm.$emit('update:model-value', 20);
      await hourBar.vm.$emit('update:model-value', 23);

      expect(wrapper.emitted('update:model-value')).toHaveLength(3);
    });

    it('should handle changes from null modelValue', async () => {
      const wrapper = createWrapper({ modelValue: null }, { format: 'HH:mm' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      await hourBar.vm.$emit('update:model-value', 12);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(12);
    });
  });

  describe('AM/PM mode', () => {
    it('should render AM/PM bar for h:mm a format', () => {
      const wrapper = createWrapper({}, { format: 'h:mm a' });
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });
      expect(timeBars).toHaveLength(3);
    });

    it('should convert 14:00 to 2 PM in 12-hour format', () => {
      const date = new Date('2023-01-15T14:30:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'h:mm a' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(2);
    });

    it('should convert 00:00 to 12 AM in 12-hour format', () => {
      const date = new Date('2023-01-15T00:30:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'h:mm a' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(12);
    });

    it('should convert 12:00 to 12 PM in 12-hour format', () => {
      const date = new Date('2023-01-15T12:30:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'h:mm a' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(12);
    });

    it('should show AM (0) for morning hours', () => {
      const date = new Date('2023-01-15T08:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'h:mm:ss a' }
      );
      const amPmBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[3];
      expect(amPmBar.props('modelValue')).toBe(0);
    });

    it('should show PM (1) for afternoon hours', () => {
      const date = new Date('2023-01-15T14:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'h:mm:ss a' }
      );
      const amPmBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[3];
      expect(amPmBar.props('modelValue')).toBe(1);
    });

    it('should pass enabledAmPm to hours bar in 12-hour format', () => {
      const wrapper = createWrapper({}, { format: 'h:mm a' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('enabledAmPm')).toBe(true);
    });

    it('should not pass enabledAmPm to hours bar in 24-hour format', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('enabledAmPm')).toBeFalsy();
    });

    it('should convert 1 PM to 13:00 when updating hour', async () => {
      const date = new Date('2023-01-15T14:00:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'h:mm a' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      await hourBar.vm.$emit('update:model-value', 1);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(13);
    });

    it('should convert 12 AM to 00:00 when updating hour', async () => {
      const date = new Date('2023-01-15T01:00:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'h:mm a' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      await hourBar.vm.$emit('update:model-value', 12);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(0);
    });

    it('should change AM to PM when updating AM/PM bar', async () => {
      const date = new Date('2023-01-15T10:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'h:mm:ss a' }
      );
      const amPmBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[3];

      await amPmBar.vm.$emit('update:model-value', 1);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(22);
    });

    it('should change PM to AM when updating AM/PM bar', async () => {
      const date = new Date('2023-01-15T14:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'h:mm:ss a' }
      );
      const amPmBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[3];

      await amPmBar.vm.$emit('update:model-value', 0);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(2);
    });
  });

  describe('AppTimeBar type props', () => {
    it('should pass Minutes type to minutes bar', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm' });
      const minuteBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[1];
      expect(minuteBar.props('type')).toBe(AppTimeBarType.Minutes);
    });

    it('should pass Seconds type to seconds bar', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm:ss' });
      const secondBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[2];
      expect(secondBar.props('type')).toBe(AppTimeBarType.Seconds);
    });

    it('should pass AmPm type to AM/PM bar', () => {
      const wrapper = createWrapper({}, { format: 'h:mm a' });
      const amPmBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[2];
      expect(amPmBar.props('type')).toBe(AppTimeBarType.AmPm);
    });

    it('should not pass type to hours bar', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('type')).toBeUndefined();
    });
  });

  describe('SelectableRange', () => {
    it('should accept selectableRange prop', () => {
      const wrapper = createWrapper({
        selectableRange: '09:00:00 - 18:00:00',
      });
      expect(wrapper.props('selectableRange')).toBe('09:00:00 - 18:00:00');
    });

    it('should constrain hour to range when selecting disabled hour', async () => {
      const date = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper(
        { modelValue: date, selectableRange: '09:00:00 - 18:00:00' },
        { format: 'HH:mm:ss' }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      await hourBar.vm.$emit('update:model-value', 20);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(18);
    });

    it('should constrain hour to minimum when selecting before range', async () => {
      const date = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper(
        { modelValue: date, selectableRange: '09:00:00 - 18:00:00' },
        { format: 'HH:mm:ss' }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      await hourBar.vm.$emit('update:model-value', 5);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(9);
    });

    it('should pass disabledValue function to hours bar', () => {
      const wrapper = createWrapper(
        { selectableRange: '09:00:00 - 18:00:00' },
        { format: 'HH:mm:ss' }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(typeof hourBar.props('disabledValue')).toBe('function');
    });

    it('should pass disabledValue function to minutes bar', () => {
      const wrapper = createWrapper(
        { selectableRange: '09:00:00 - 18:00:00' },
        { format: 'HH:mm:ss' }
      );
      const minuteBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[1];
      expect(typeof minuteBar.props('disabledValue')).toBe('function');
    });

    it('should pass disabledValue function to seconds bar', () => {
      const wrapper = createWrapper(
        { selectableRange: '09:00:00 - 18:00:00' },
        { format: 'HH:mm:ss' }
      );
      const secondBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[2];
      expect(typeof secondBar.props('disabledValue')).toBe('function');
    });

    it('should handle invalid selectableRange format', () => {
      const wrapper = createWrapper(
        { selectableRange: 'invalid' },
        { format: 'HH:mm' }
      );
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle undefined selectableRange', () => {
      const wrapper = createWrapper(
        { selectableRange: undefined },
        { format: 'HH:mm' }
      );
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('DisabledValue with custom isDisabledDate', () => {
    it('should use isDisabledDate when not in range mode', () => {
      const isDisabledDate = vi.fn(() => false);
      const wrapper = createWrapper(
        {},
        { format: 'HH:mm', isRange: false, isDisabledDate }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      const disabledFn = hourBar.props('disabledValue');

      disabledFn(10);

      expect(isDisabledDate).toHaveBeenCalled();
    });

    it('should not use isDisabledDate when in range mode', () => {
      const isDisabledDate = vi.fn(() => false);
      const wrapper = createWrapper(
        {},
        { format: 'HH:mm', isRange: true, isDisabledDate }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      const disabledFn = hourBar.props('disabledValue');

      disabledFn(10);

      expect(isDisabledDate).not.toHaveBeenCalled();
    });

    it('should return disabled for hours outside selectableRange', () => {
      const wrapper = createWrapper(
        { selectableRange: '09:00:00 - 18:00:00' },
        { format: 'HH:mm:ss' }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      const disabledFn = hourBar.props('disabledValue');

      expect(disabledFn(8)).toBe(true);
      expect(disabledFn(19)).toBe(true);
      expect(disabledFn(12)).toBe(false);
    });

    it('should return disabled for minutes outside selectableRange', () => {
      const date = new Date('2023-01-15T09:00:00');
      const wrapper = createWrapper(
        { modelValue: date, selectableRange: '09:30:00 - 18:00:00' },
        { format: 'HH:mm:ss' }
      );
      const minuteBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[1];
      const disabledFn = minuteBar.props('disabledValue');

      expect(disabledFn(15)).toBe(true);
      expect(disabledFn(45)).toBe(false);
    });

    it('should return disabled for seconds outside selectableRange', () => {
      const date = new Date('2023-01-15T09:30:00');
      const wrapper = createWrapper(
        { modelValue: date, selectableRange: '09:30:30 - 18:00:00' },
        { format: 'HH:mm:ss' }
      );
      const secondBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[2];
      const disabledFn = secondBar.props('disabledValue');

      expect(disabledFn(15)).toBe(true);
      expect(disabledFn(45)).toBe(false);
    });
  });

  describe('ModelValue reactivity', () => {
    it('should update displayed hours when modelValue changes', async () => {
      const date1 = new Date('2023-01-15T10:00:00');
      const date2 = new Date('2023-01-15T14:00:00');
      const wrapper = createWrapper(
        { modelValue: date1 },
        { format: 'HH:mm:ss' }
      );

      await wrapper.setProps({ modelValue: date2 });

      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(14);
    });

    it('should update displayed minutes when modelValue changes', async () => {
      const date1 = new Date('2023-01-15T10:15:00');
      const date2 = new Date('2023-01-15T10:45:00');
      const wrapper = createWrapper(
        { modelValue: date1 },
        { format: 'HH:mm:ss' }
      );

      await wrapper.setProps({ modelValue: date2 });

      const minuteBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[1];
      expect(minuteBar.props('modelValue')).toBe(45);
    });

    it('should update displayed seconds when modelValue changes', async () => {
      const date1 = new Date('2023-01-15T10:15:20');
      const date2 = new Date('2023-01-15T10:15:50');
      const wrapper = createWrapper(
        { modelValue: date1 },
        { format: 'HH:mm:ss' }
      );

      await wrapper.setProps({ modelValue: date2 });

      const secondBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[2];
      expect(secondBar.props('modelValue')).toBe(50);
    });

    it('should handle modelValue changing from null to Date', async () => {
      const wrapper = createWrapper({ modelValue: null }, { format: 'HH:mm' });
      const date = new Date('2023-01-15T14:30:00');

      await wrapper.setProps({ modelValue: date });

      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(14);
    });

    it('should handle modelValue changing from Date to null', async () => {
      const date = new Date('2023-01-15T14:30:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'HH:mm' });

      await wrapper.setProps({ modelValue: null });

      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(0);
    });

    it('should constrain new modelValue to selectableRange', async () => {
      const date1 = new Date('2023-01-15T10:00:00');
      const date2 = new Date('2023-01-15T20:00:00');
      const wrapper = createWrapper(
        { modelValue: date1, selectableRange: '09:00:00 - 18:00:00' },
        { format: 'HH:mm:ss' }
      );

      await wrapper.setProps({ modelValue: date2 });

      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(18);
    });

    it('should not update if new modelValue is same as current', async () => {
      const date = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'HH:mm' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      const initialValue = hourBar.props('modelValue');

      await wrapper.setProps({ modelValue: new Date(date.getTime()) });

      expect(hourBar.props('modelValue')).toBe(initialValue);
    });
  });

  describe('Format reactivity', () => {
    it('should update component count when format changes', async () => {
      const wrapper = createWrapper({}, { format: 'HH:mm' });
      expect(wrapper.findAllComponents({ name: 'AppTimeBar' })).toHaveLength(2);

      mockAppTimePickerComponentData.value.format = 'HH:mm:ss';
      await nextTick();

      expect(wrapper.findAllComponents({ name: 'AppTimeBar' })).toHaveLength(3);
    });

    it('should add AM/PM bar when format changes to 12-hour', async () => {
      const wrapper = createWrapper({}, { format: 'HH:mm' });
      expect(wrapper.findAllComponents({ name: 'AppTimeBar' })).toHaveLength(2);

      mockAppTimePickerComponentData.value.format = 'h:mm a';
      await nextTick();

      expect(wrapper.findAllComponents({ name: 'AppTimeBar' })).toHaveLength(3);
    });

    it('should remove seconds bar when format changes', async () => {
      const wrapper = createWrapper({}, { format: 'HH:mm:ss' });
      expect(wrapper.findAllComponents({ name: 'AppTimeBar' })).toHaveLength(3);

      mockAppTimePickerComponentData.value.format = 'HH:mm';
      await nextTick();

      expect(wrapper.findAllComponents({ name: 'AppTimeBar' })).toHaveLength(2);
    });

    it('should convert hours display when switching to 12-hour format', async () => {
      const date = new Date('2023-01-15T14:30:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'HH:mm' });
      let hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(14);

      mockAppTimePickerComponentData.value.format = 'h:mm a';
      await nextTick();

      hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];
      expect(hourBar.props('modelValue')).toBe(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle midnight (00:00:00)', () => {
      const date = new Date('2023-01-15T00:00:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });

      expect(timeBars[0].props('modelValue')).toBe(0);
      expect(timeBars[1].props('modelValue')).toBe(0);
      expect(timeBars[2].props('modelValue')).toBe(0);
    });

    it('should handle end of day (23:59:59)', () => {
      const date = new Date('2023-01-15T23:59:59');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });

      expect(timeBars[0].props('modelValue')).toBe(23);
      expect(timeBars[1].props('modelValue')).toBe(59);
      expect(timeBars[2].props('modelValue')).toBe(59);
    });

    it('should handle noon (12:00:00) in 12-hour format', () => {
      const date = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'h:mm a' });
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });

      expect(timeBars[0].props('modelValue')).toBe(12);
      expect(timeBars[2].props('modelValue')).toBe(1);
    });

    it('should handle rapid consecutive updates', async () => {
      const date = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      for (let i = 0; i < 5; i++) {
        await hourBar.vm.$emit('update:model-value', 10 + i);
      }

      expect(wrapper.emitted('update:model-value')).toHaveLength(5);
    });

    it('should handle invalid date in modelValue', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date('invalid') },
        { format: 'HH:mm' }
      );
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle empty format string', () => {
      const wrapper = createWrapper({}, { format: '' });
      expect(wrapper.findAllComponents({ name: 'AppTimeBar' })).toHaveLength(0);
    });

    it('should handle format with only separators', () => {
      const wrapper = createWrapper({}, { format: ':::' });
      expect(wrapper.findAllComponents({ name: 'AppTimeBar' })).toHaveLength(0);
    });

    it('should handle missing provide data', () => {
      const wrapper = shallowMount(AppController, {
        props: { modelValue: null },
        global: {
          stubs: {
            AppTimeBar: {
              name: 'AppTimeBar',
              template: '<div></div>',
            },
          },
        },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle selectableRange with same start and end time', () => {
      const wrapper = createWrapper(
        { selectableRange: '12:00:00 - 12:00:00' },
        { format: 'HH:mm:ss' }
      );
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle updating to hour 0', async () => {
      const date = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'HH:mm' });
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      await hourBar.vm.$emit('update:model-value', 0);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(0);
    });

    it('should handle updating to minute 0', async () => {
      const date = new Date('2023-01-15T12:30:00');
      const wrapper = createWrapper({ modelValue: date }, { format: 'HH:mm' });
      const minuteBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[1];

      await minuteBar.vm.$emit('update:model-value', 0);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getMinutes()).toBe(0);
    });

    it('should handle updating to second 0', async () => {
      const date = new Date('2023-01-15T12:30:30');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const secondBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[2];

      await secondBar.vm.$emit('update:model-value', 0);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getSeconds()).toBe(0);
    });
  });

  describe('Separator display', () => {
    it('should show colon separator between components', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm:ss' });
      const separators = wrapper.findAll('div');
      expect(separators[0].text()).toBe(':');
      expect(separators[1].text()).toBe(':');
    });

    it('should show separator between minutes and seconds', () => {
      const wrapper = createWrapper({}, { format: 'mm:ss' });
      const separators = wrapper.findAll('div');
      expect(separators).toHaveLength(1);
    });
  });

  describe('Component integration', () => {
    it('should maintain consistency between all time components', async () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const timeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });

      expect(timeBars[0].props('modelValue')).toBe(14);
      expect(timeBars[1].props('modelValue')).toBe(30);
      expect(timeBars[2].props('modelValue')).toBe(45);

      await timeBars[0].vm.$emit('update:model-value', 16);
      await wrapper.setProps({
        // @ts-expect-error - testing emitted value
        modelValue: wrapper.emitted('update:model-value')?.[0]?.[0],
      });

      const updatedTimeBars = wrapper.findAllComponents({ name: 'AppTimeBar' });
      expect(updatedTimeBars[0].props('modelValue')).toBe(16);
      expect(updatedTimeBars[1].props('modelValue')).toBe(30);
      expect(updatedTimeBars[2].props('modelValue')).toBe(45);
    });

    it('should handle switching between AM and PM with hour updates', async () => {
      const date = new Date('2023-01-15T10:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'h:mm:ss a' }
      );

      const amPmBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[3];
      await amPmBar.vm.$emit('update:model-value', 1);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(22);
    });

    it('should maintain minutes and seconds when hour changes', async () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const hourBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[0];

      await hourBar.vm.$emit('update:model-value', 16);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getMinutes()).toBe(30);
      expect(emittedDate.getSeconds()).toBe(45);
    });

    it('should maintain hours and seconds when minute changes', async () => {
      const date = new Date('2023-01-15T14:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { format: 'HH:mm:ss' }
      );
      const minuteBar = wrapper.findAllComponents({ name: 'AppTimeBar' })[1];

      await minuteBar.vm.$emit('update:model-value', 45);

      const emittedDate = wrapper.emitted(
        'update:model-value'
      )?.[0]?.[0] as Date;
      expect(emittedDate.getHours()).toBe(14);
      expect(emittedDate.getSeconds()).toBe(45);
    });
  });
});
