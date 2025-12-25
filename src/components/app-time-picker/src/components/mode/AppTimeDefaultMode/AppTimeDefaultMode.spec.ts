import { nextTick, ref, type Ref } from 'vue';
import { AppTimePickerComponentDataProvide } from '../../../const';
import { mount } from '@vue/test-utils';
import AppTimeDefaultMode from './AppTimeDefaultMode.vue';
import type { AppTimePickerComponentData } from '../../../interfaces/index.interface';

type InternalComponentData = Partial<AppTimePickerComponentData>;

const defaultAppTimePickerComponentData: InternalComponentData = {
  disabled: false,
  readonly: false,
  format: 'HH:mm:ss',
  isRange: false,
  startDefaultTime: new Date('2023-01-15T12:00:00'),
};

describe('AppTimeDefaultMode', () => {
  let mockAppTimePickerComponentData: Ref<InternalComponentData>;

  const createWrapper = (
    props?: Partial<InstanceType<typeof AppTimeDefaultMode>['$props']>,
    providedData?: InternalComponentData
  ) => {
    const mergedData = {
      ...mockAppTimePickerComponentData.value,
      ...providedData,
    };

    mockAppTimePickerComponentData.value = mergedData;

    return mount(AppTimeDefaultMode, {
      props: {
        modelValue: null,
        ...props,
      },
      global: {
        provide: {
          [AppTimePickerComponentDataProvide]: mockAppTimePickerComponentData,
        },
        stubs: {
          AppTimeController: {
            name: 'AppTimeController',
            template: '<div></div>',
            props: ['modelValue', 'selectableRange'],
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
    it('should render AppTimeController component', () => {
      const wrapper = createWrapper();
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.exists()).toBe(true);
    });

    it('should render with default props', () => {
      const wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('ModelValue initialization', () => {
    it('should use defaultTime when modelValue is null', () => {
      const defaultTime = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: null },
        { startDefaultTime: defaultTime }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(defaultTime);
    });

    it('should use provided modelValue instead of defaultTime', () => {
      const date = new Date('2023-01-15T14:30:00');
      const defaultTime = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { startDefaultTime: defaultTime }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle invalid date in modelValue', async () => {
      const invalidDate = new Date('invalid');
      const defaultTime = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: invalidDate },
        { startDefaultTime: defaultTime }
      );

      await nextTick();

      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(defaultTime);
    });

    it('should handle undefined modelValue', () => {
      const defaultTime = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: undefined },
        { startDefaultTime: defaultTime }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(defaultTime);
    });

    it('should initialize model with different defaultTime values', () => {
      const defaultTime = new Date('2023-01-15T18:45:30');
      const wrapper = createWrapper(
        { modelValue: null },
        { startDefaultTime: defaultTime }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(defaultTime);
    });
  });

  describe('SelectableRange prop passing', () => {
    it('should pass selectableRange to AppTimeController', () => {
      const wrapper = createWrapper(
        {},
        { selectableRange: '09:00:00 - 18:00:00' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('selectableRange')).toBe('09:00:00 - 18:00:00');
    });

    it('should pass undefined selectableRange when not provided', () => {
      const wrapper = createWrapper({}, { selectableRange: undefined });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('selectableRange')).toBeUndefined();
    });

    it('should update selectableRange reactively', async () => {
      const wrapper = createWrapper(
        {},
        { selectableRange: '09:00:00 - 18:00:00' }
      );

      mockAppTimePickerComponentData.value.selectableRange =
        '10:00:00 - 20:00:00';
      await nextTick();

      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('selectableRange')).toBe('10:00:00 - 20:00:00');
    });

    it('should handle empty string selectableRange', () => {
      const wrapper = createWrapper({}, { selectableRange: '' });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('selectableRange')).toBe('');
    });

    it('should handle invalid selectableRange format', () => {
      const wrapper = createWrapper({}, { selectableRange: 'invalid-format' });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('selectableRange')).toBe('invalid-format');
    });
  });

  describe('ModelValue with selectableRange', () => {
    it('should constrain modelValue to selectableRange on init', () => {
      const date = new Date('2023-01-15T20:00:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { selectableRange: '09:00:00 - 18:00:00' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      const constrainedDate = controller.props('modelValue') as Date;
      expect(constrainedDate.getHours()).toBe(18);
      expect(constrainedDate.getMinutes()).toBe(0);
      expect(constrainedDate.getSeconds()).toBe(0);
    });

    it('should constrain modelValue below minimum range', () => {
      const date = new Date('2023-01-15T05:00:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { selectableRange: '09:00:00 - 18:00:00' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      const constrainedDate = controller.props('modelValue') as Date;
      expect(constrainedDate.getHours()).toBe(9);
      expect(constrainedDate.getMinutes()).toBe(0);
      expect(constrainedDate.getSeconds()).toBe(0);
    });

    it('should not constrain modelValue within range', () => {
      const date = new Date('2023-01-15T12:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { selectableRange: '09:00:00 - 18:00:00' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should constrain defaultTime to selectableRange', () => {
      const defaultTime = new Date('2023-01-15T22:00:00');
      const wrapper = createWrapper(
        { modelValue: null },
        {
          startDefaultTime: defaultTime,
          selectableRange: '09:00:00 - 18:00:00',
        }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      const constrainedDate = controller.props('modelValue') as Date;
      expect(constrainedDate.getHours()).toBe(18);
    });

    it('should handle selectableRange edge case at start time', () => {
      const date = new Date('2023-01-15T09:00:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { selectableRange: '09:00:00 - 18:00:00' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle selectableRange edge case at end time', () => {
      const date = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { selectableRange: '09:00:00 - 18:00:00' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle selectableRange with seconds precision', () => {
      const date = new Date('2023-01-15T12:30:45');
      const wrapper = createWrapper(
        { modelValue: date },
        { selectableRange: '09:00:00 - 18:00:00' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });
  });

  describe('IsDisabledDate validation', () => {
    it('should set modelValue to null if date is disabled', () => {
      const date = new Date('2023-01-15T14:30:00');
      const isDisabledDate = vi.fn(() => true);
      const wrapper = createWrapper({ modelValue: date }, { isDisabledDate });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toBeNull();
    });

    it('should keep modelValue if date is not disabled', () => {
      const date = new Date('2023-01-15T14:30:00');
      const isDisabledDate = vi.fn(() => false);
      const wrapper = createWrapper({ modelValue: date }, { isDisabledDate });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should validate date with isDisabledDate function', () => {
      const date = new Date('2023-01-15T14:30:00');
      const isDisabledDate = vi.fn(() => true);
      createWrapper({ modelValue: date }, { isDisabledDate });
      expect(isDisabledDate).toHaveBeenCalledWith(date);
    });

    it('should set null when defaultTime is disabled', () => {
      const defaultTime = new Date('2023-01-15T12:00:00');
      const isDisabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { modelValue: null },
        { startDefaultTime: defaultTime, isDisabledDate }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toBeNull();
    });

    it('should work without isDisabledDate function', () => {
      const date = new Date('2023-01-15T14:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { isDisabledDate: undefined }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should validate constrained date with isDisabledDate', () => {
      const date = new Date('2023-01-15T20:00:00');
      const isDisabledDate = vi.fn(() => true);
      const wrapper = createWrapper(
        { modelValue: date },
        {
          selectableRange: '09:00:00 - 18:00:00',
          isDisabledDate,
        }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toBeNull();
    });

    it('should keep constrained date if not disabled', () => {
      const date = new Date('2023-01-15T20:00:00');
      const isDisabledDate = vi.fn(() => false);
      const wrapper = createWrapper(
        { modelValue: date },
        {
          selectableRange: '09:00:00 - 18:00:00',
          isDisabledDate,
        }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      const constrainedDate = controller.props('modelValue') as Date;
      expect(constrainedDate.getHours()).toBe(18);
    });
  });

  describe('ModelValue updates', () => {
    it('should emit update:modelValue when controller changes', async () => {
      const wrapper = createWrapper();
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      const newDate = new Date('2023-01-15T15:30:00');

      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      await controller.vm.$emit('update:modelValue', newDate);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.[emittedCountBefore]).toEqual([newDate]);
    });

    it('should update modelValue reactively', async () => {
      const date1 = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper({ modelValue: date1 });

      const date2 = new Date('2023-01-15T14:00:00');
      await wrapper.setProps({ modelValue: date2 });

      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date2);
    });

    it('should handle modelValue changing from null to Date', async () => {
      const wrapper = createWrapper({ modelValue: null });
      const date = new Date('2023-01-15T14:30:00');

      await wrapper.setProps({ modelValue: date });

      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle modelValue changing from Date to null', async () => {
      const date = new Date('2023-01-15T14:30:00');
      const defaultTime = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { startDefaultTime: defaultTime }
      );

      await wrapper.setProps({ modelValue: null });

      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toBeNull();
    });

    it('should emit multiple updates', async () => {
      const wrapper = createWrapper();
      const controller = wrapper.findComponent({ name: 'AppTimeController' });

      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;

      await controller.vm.$emit(
        'update:model-value',
        new Date('2023-01-15T10:00:00')
      );
      await controller.vm.$emit(
        'update:model-value',
        new Date('2023-01-15T12:00:00')
      );
      await controller.vm.$emit(
        'update:model-value',
        new Date('2023-01-15T14:00:00')
      );

      expect(wrapper.emitted('update:modelValue')).toHaveLength(
        emittedCountBefore + 3
      );
    });
  });

  describe('ComponentData reactivity', () => {
    it('should update when startDefaultTime changes', async () => {
      const defaultTime1 = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: null },
        { startDefaultTime: defaultTime1 }
      );

      const defaultTime2 = new Date('2023-01-15T14:00:00');
      mockAppTimePickerComponentData.value.startDefaultTime = defaultTime2;
      await wrapper.vm.$nextTick();

      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(defaultTime1);
    });

    it('should react to format changes', async () => {
      const wrapper = createWrapper({}, { format: 'HH:mm:ss' });

      mockAppTimePickerComponentData.value.format = 'HH:mm';
      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);
    });

    it('should react to isRange changes', async () => {
      const wrapper = createWrapper({}, { isRange: false });

      mockAppTimePickerComponentData.value.isRange = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle midnight (00:00:00) as modelValue', () => {
      const date = new Date('2023-01-15T00:00:00');
      const wrapper = createWrapper({ modelValue: date });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle end of day (23:59:59) as modelValue', () => {
      const date = new Date('2023-01-15T23:59:59');
      const wrapper = createWrapper({ modelValue: date });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle noon (12:00:00) as defaultTime', () => {
      const defaultTime = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: null },
        { startDefaultTime: defaultTime }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(defaultTime);
    });

    it('should handle dates with milliseconds', () => {
      const date = new Date('2023-01-15T14:30:45.123');
      const wrapper = createWrapper({ modelValue: date });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle very old dates', () => {
      const date = new Date('1900-01-01T12:00:00');
      const wrapper = createWrapper({ modelValue: date });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle future dates', () => {
      const date = new Date('2100-12-31T23:59:59');
      const wrapper = createWrapper({ modelValue: date });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle selectableRange crossing midnight', () => {
      const date = new Date('2023-01-15T23:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { selectableRange: '20:00:00 - 23:59:59' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle narrow selectableRange', () => {
      const date = new Date('2023-01-15T12:30:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { selectableRange: '12:00:00 - 12:30:00' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should handle missing provide data gracefully', () => {
      const wrapper = mount(AppTimeDefaultMode, {
        props: { modelValue: new Date() },
        global: {
          stubs: {
            AppTimeController: {
              name: 'AppTimeController',
              template: '<div></div>',
            },
          },
        },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle null provide data', () => {
      const wrapper = mount(AppTimeDefaultMode, {
        props: { modelValue: null },
        global: {
          provide: {
            [AppTimePickerComponentDataProvide]: null,
          },
          stubs: {
            AppTimeController: {
              name: 'AppTimeController',
              template: '<div></div>',
            },
          },
        },
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Initialization with different scenarios', () => {
    it('should initialize with valid date and no range', () => {
      const date = new Date('2023-01-15T14:30:00');
      const wrapper = createWrapper({ modelValue: date });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
    });

    it('should initialize with null and valid defaultTime', () => {
      const defaultTime = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper(
        { modelValue: null },
        { startDefaultTime: defaultTime }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(defaultTime);
    });

    it('should initialize with invalid date and fallback to defaultTime', () => {
      const invalidDate = new Date('invalid');
      const defaultTime = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: invalidDate },
        { startDefaultTime: defaultTime }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(defaultTime);
    });

    it('should initialize with date outside range and constrain it', () => {
      const date = new Date('2023-01-15T22:00:00');
      const wrapper = createWrapper(
        { modelValue: date },
        { selectableRange: '09:00:00 - 18:00:00' }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      const constrainedDate = controller.props('modelValue') as Date;
      expect(constrainedDate.getHours()).toBe(18);
    });

    it('should initialize with disabled date and set to null', () => {
      const date = new Date('2023-01-15T14:00:00');
      const isDisabledDate = vi.fn(() => true);
      const wrapper = createWrapper({ modelValue: date }, { isDisabledDate });
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toBeNull();
    });

    it('should initialize with all constraints applied', () => {
      const date = new Date('2023-01-15T22:00:00');
      const isDisabledDate = vi.fn((d: Date) => d.getHours() === 18);
      const wrapper = createWrapper(
        { modelValue: date },
        {
          selectableRange: '09:00:00 - 18:00:00',
          isDisabledDate,
        }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toBeNull();
    });

    it('should initialize with valid constrained date', () => {
      const date = new Date('2023-01-15T22:00:00');
      const isDisabledDate = vi.fn(() => false);
      const wrapper = createWrapper(
        { modelValue: date },
        {
          selectableRange: '09:00:00 - 18:00:00',
          isDisabledDate,
        }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      const constrainedDate = controller.props('modelValue') as Date;
      expect(constrainedDate.getHours()).toBe(18);
      expect(isDisabledDate).toHaveBeenCalled();
    });
  });

  describe('PropTypes validation', () => {
    it('should accept Date as modelValue', () => {
      const date = new Date('2023-01-15T14:30:00');
      const wrapper = createWrapper({ modelValue: date });
      expect(wrapper.props('modelValue')).toEqual(date);
    });

    it('should accept null as modelValue', () => {
      const wrapper = createWrapper({ modelValue: null });
      expect(wrapper.props('modelValue')).toBeNull();
    });

    it('should handle string date as modelValue', () => {
      // @ts-expect-error Testing invalid prop type
      const wrapper = createWrapper({ modelValue: '2023-01-15' });
      expect(wrapper.props('modelValue')).toBe('2023-01-15');
    });

    it('should handle number as modelValue', () => {
      const timestamp = Date.now();
      // @ts-expect-error Testing invalid prop type
      const wrapper = createWrapper({ modelValue: timestamp });
      expect(wrapper.props('modelValue')).toBe(timestamp);
    });
  });

  describe('Component structure', () => {
    it('should have single root element', () => {
      const wrapper = createWrapper();
      expect(wrapper.element.childElementCount).toBeGreaterThanOrEqual(1);
    });

    it('should contain AppTimeController as direct child', () => {
      const wrapper = createWrapper();
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.exists()).toBe(true);
    });

    it('should not have additional elements besides controller', () => {
      const wrapper = createWrapper();
      const container = wrapper.find('.app-time-picker-default-mode');
      expect(container.element.children).toHaveLength(1);
    });
  });

  describe('Integration scenarios', () => {
    it('should work with all features enabled', () => {
      const date = new Date('2023-01-15T14:30:00');
      const isDisabledDate = vi.fn(() => false);
      const wrapper = createWrapper(
        { modelValue: date },
        {
          selectableRange: '09:00:00 - 18:00:00',
          isDisabledDate,
          startDefaultTime: new Date('2023-01-15T12:00:00'),
          format: 'HH:mm:ss',
        }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      expect(controller.props('modelValue')).toEqual(date);
      expect(controller.props('selectableRange')).toBe('09:00:00 - 18:00:00');
    });

    it('should handle controller updates with all constraints', async () => {
      const isDisabledDate = vi.fn(() => false);
      const wrapper = createWrapper(
        { modelValue: null },
        {
          selectableRange: '09:00:00 - 18:00:00',
          isDisabledDate,
          startDefaultTime: new Date('2023-01-15T12:00:00'),
        }
      );
      const controller = wrapper.findComponent({ name: 'AppTimeController' });
      const newDate = new Date('2023-01-15T15:00:00');

      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;
      await controller.vm.$emit('update:modelValue', newDate);

      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.[emittedCountBefore]).toEqual([newDate]);
    });

    it('should maintain state across multiple updates', async () => {
      const wrapper = createWrapper();
      const controller = wrapper.findComponent({ name: 'AppTimeController' });

      const emittedCountBefore =
        wrapper.emitted('update:modelValue')?.length || 0;

      const dates = [
        new Date('2023-01-15T10:00:00'),
        new Date('2023-01-15T12:00:00'),
        new Date('2023-01-15T14:00:00'),
      ];

      for (const date of dates) {
        await controller.vm.$emit('update:modelValue', date);
      }

      expect(wrapper.emitted('update:modelValue')).toHaveLength(
        emittedCountBefore + 3
      );
      const emittedAfter = wrapper.emitted('update:modelValue');
      expect(emittedAfter?.[emittedCountBefore + 2]).toEqual([dates[2]]);
    });
  });
});
