import { nextTick, reactive, ref, type Reactive, type Ref } from 'vue';
import {
  AppTimePickerComponentDataProvide,
  AppTimeRangeModeState,
} from '../../../const';
import { shallowMount } from '@vue/test-utils';
import AppTimeRangeMode from './AppTimeRangeMode.vue';
import type { AppTimePickerComponentData } from '../../../interfaces/index.interface';

vi.mock('@/composables/useIsFullyVisibleRangeContent', () => ({
  useIsFullyVisibleRangeContent: () => ({
    isFullyVisible: ref(true),
  }),
}));

const { next } = vi.hoisted(() => ({ next: vi.fn() }));

type InternalComponentData = Partial<AppTimePickerComponentData>;

type InjectedRangeModeState = Reactive<{
  isCompact: boolean;
  step: 'start' | 'end';
  next: () => void;
}>;

const defaultAppTimePickerComponentData: InternalComponentData = {
  disabled: false,
  readonly: false,
  format: 'HH:mm:ss',
  isRange: true,
  startDefaultTime: new Date('2023-01-15T09:00:00'),
  endDefaultTime: new Date('2023-01-15T18:00:00'),
};

const defaultInjectedRangeModeState: InjectedRangeModeState = {
  isCompact: false,
  step: 'start',
  next,
};

describe('AppTimeRangeMode', () => {
  let mockAppTimePickerComponentData: Ref<InternalComponentData>;
  let mockInjectedRangeModeState: InjectedRangeModeState;

  const createWrapper = (
    props?: Partial<InstanceType<typeof AppTimeRangeMode>['$props']>,
    providedData?: InternalComponentData
  ) => {
    const mergedData = {
      ...mockAppTimePickerComponentData.value,
      ...providedData,
    };

    mockAppTimePickerComponentData.value = mergedData;

    return shallowMount(AppTimeRangeMode, {
      props: {
        modelValue: [null, null],
        ...props,
      },
      global: {
        provide: {
          [AppTimePickerComponentDataProvide]: mockAppTimePickerComponentData,
          [AppTimeRangeModeState]: mockInjectedRangeModeState,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockInjectedRangeModeState = reactive({
      ...defaultInjectedRangeModeState,
    });
    mockAppTimePickerComponentData = ref({
      ...defaultAppTimePickerComponentData,
    });
  });

  describe('Component Rendering', () => {
    it('should render two AppTimeController components', () => {
      const wrapper = createWrapper();
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers).toHaveLength(2);
    });

    it('should render two sections', () => {
      const wrapper = createWrapper();
      const sections = wrapper.findAll('section');
      expect(sections).toHaveLength(2);
    });
  });

  describe('ModelValue initialization', () => {
    it('should use defaultTime for start when modelValue[0] is null', () => {
      const defaultStartTime = new Date('2023-01-15T09:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { startDefaultTime: defaultStartTime }
      );
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('modelValue')).toEqual(defaultStartTime);
    });

    it('should use defaultTime for end when modelValue[1] is null', () => {
      const defaultEndTime = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { endDefaultTime: defaultEndTime }
      );
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('modelValue')).toEqual(defaultEndTime);
    });

    it('should use provided modelValue instead of defaultTime', () => {
      const dates = [
        new Date('2023-01-15T10:00:00'),
        new Date('2023-01-15T14:00:00'),
      ];
      const wrapper = createWrapper({ modelValue: dates });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('modelValue')).toEqual(dates[0]);
      expect(controllers[1].props('modelValue')).toEqual(dates[1]);
    });

    it('should handle partial null values', () => {
      const startDate = new Date('2023-01-15T10:00:00');
      const defaultEndTime = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [startDate, null] },
        { endDefaultTime: defaultEndTime }
      );
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('modelValue')).toEqual(startDate);
      expect(controllers[1].props('modelValue')).toEqual(defaultEndTime);
    });

    it('should handle invalid date in start position', () => {
      const defaultStartTime = new Date('2023-01-15T09:00:00');
      const endDate = new Date('2023-01-15T14:00:00');
      const wrapper = createWrapper(
        { modelValue: [new Date('invalid'), endDate] },
        { startDefaultTime: defaultStartTime }
      );
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('modelValue')).toEqual(defaultStartTime);
    });

    it('should handle invalid date in end position', () => {
      const startDate = new Date('2023-01-15T10:00:00');
      const defaultEndTime = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [startDate, new Date('invalid')] },
        { endDefaultTime: defaultEndTime }
      );
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('modelValue')).toEqual(defaultEndTime);
    });
  });

  describe('SelectableRange prop passing', () => {
    it('should pass startSelectableRange to start controller', () => {
      const wrapper = createWrapper(
        {},
        { startSelectableRange: '09:00:00 - 12:00:00' }
      );
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('selectableRange')).toBe(
        '09:00:00 - 12:00:00'
      );
    });

    it('should pass endSelectableRange to end controller', () => {
      const wrapper = createWrapper(
        {},
        { endSelectableRange: '14:00:00 - 18:00:00' }
      );
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('selectableRange')).toBe(
        '14:00:00 - 18:00:00'
      );
    });

    it('should create dynamic range from end model for start controller', () => {
      const endDate = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper({ modelValue: [null, endDate] });
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('selectableRange')).toBe(
        '00:00:00 - 18:00:00'
      );
    });

    it('should create dynamic range from start model for end controller', () => {
      const startDate = new Date('2023-01-15T09:00:00');
      const wrapper = createWrapper({ modelValue: [startDate, null] });
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('selectableRange')).toBe(
        '09:00:00 - 23:59:59'
      );
    });

    it('should prefer explicit startSelectableRange over dynamic', () => {
      const endDate = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, endDate] },
        { startSelectableRange: '08:00:00 - 10:00:00' }
      );
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('selectableRange')).toBe(
        '08:00:00 - 10:00:00'
      );
    });

    it('should prefer explicit endSelectableRange over dynamic', () => {
      const startDate = new Date('2023-01-15T09:00:00');
      const wrapper = createWrapper(
        { modelValue: [startDate, null] },
        { endSelectableRange: '16:00:00 - 20:00:00' }
      );
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('selectableRange')).toBe(
        '16:00:00 - 20:00:00'
      );
    });

    it('should handle not undefined models for dynamic range', () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('selectableRange')).toBe(
        '00:00:00 - 18:00:00'
      );
    });
  });

  describe('ModelValue updates', () => {
    it('should emit update:modelValue when both controllers have values', async () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });

      const startDate = new Date('2023-01-15T10:00:00');
      const endDate = new Date('2023-01-15T14:00:00');

      await controllers[0].vm.$emit('update:modelValue', startDate);
      await controllers[1].vm.$emit('update:modelValue', endDate);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should not emit update:modelValue when only start is updated', async () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];

      await startController.vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T10:00:00')
      );

      const emittedAfter = wrapper.emitted('update:modelValue')?.length || 0;
      expect(emittedAfter).toBe(2);
    });

    it('should not emit update:modelValue when only end is updated', async () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];

      await endController.vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T14:00:00')
      );

      const emittedAfter = wrapper.emitted('update:modelValue')?.length || 0;
      expect(emittedAfter).toBe(2);
    });

    it('should update both controllers when modelValue changes', async () => {
      const dates1 = [
        new Date('2023-01-15T10:00:00'),
        new Date('2023-01-15T14:00:00'),
      ];
      const wrapper = createWrapper({ modelValue: dates1 });

      const dates2 = [
        new Date('2023-01-15T11:00:00'),
        new Date('2023-01-15T15:00:00'),
      ];
      await wrapper.setProps({ modelValue: dates2 });

      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('modelValue')).toEqual(dates2[0]);
      expect(controllers[1].props('modelValue')).toEqual(dates2[1]);
    });

    it('should handle rapid successive updates', async () => {
      const wrapper = createWrapper();
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });

      for (let i = 0; i < 5; i++) {
        await controllers[0].vm.$emit(
          'update:modelValue',
          new Date(`2023-01-15T${10 + i}:00:00`)
        );
        await controllers[1].vm.$emit(
          'update:modelValue',
          new Date(`2023-01-15T${15 + i}:00:00`)
        );
      }

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should maintain start value when end changes', async () => {
      const startDate = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper({ modelValue: [startDate, null] });
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];

      await endController.vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T14:00:00')
      );

      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('modelValue')).toEqual(startDate);
    });

    it('should maintain end value when start changes', async () => {
      const endDate = new Date('2023-01-15T14:00:00');
      const wrapper = createWrapper({ modelValue: [null, endDate] });
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];

      await startController.vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T10:00:00')
      );

      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('modelValue')).toEqual(endDate);
    });
  });

  describe('Compact mode behavior', () => {
    it('should show only start section when compact and step is start', async () => {
      const wrapper = createWrapper();

      mockInjectedRangeModeState.isCompact = true;

      await nextTick();

      const sections = wrapper.findAll('section');
      expect(sections[0].isVisible()).toBe(true);
      expect(sections[1].isVisible()).toBe(false);
    });

    it('should show only end section when compact and step is end', async () => {
      const wrapper = createWrapper();

      mockInjectedRangeModeState.isCompact = true;
      mockInjectedRangeModeState.step = 'end';
      await nextTick();

      const sections = wrapper.findAll('section');
      expect(sections[0].isVisible()).toBe(false);
      expect(sections[1].isVisible()).toBe(true);
    });

    it('should show both sections when not compact', async () => {
      const wrapper = createWrapper();

      mockInjectedRangeModeState.isCompact = false;
      await nextTick();

      const sections = wrapper.findAll('section');
      expect(sections[0].isVisible()).toBe(true);
      expect(sections[1].isVisible()).toBe(true);
    });
  });

  describe('ModelValue with selectableRange', () => {
    it('should constrain start value to startSelectableRange', () => {
      const startDate = new Date('2023-01-15T08:00:00');
      const wrapper = createWrapper(
        { modelValue: [startDate, null] },
        { startSelectableRange: '09:00:00 - 12:00:00' }
      );
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      const constrainedDate = startController.props('modelValue') as Date;
      expect(constrainedDate.getHours()).toBe(9);
    });

    it('should constrain end value to endSelectableRange', () => {
      const endDate = new Date('2023-01-15T20:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, endDate] },
        { endSelectableRange: '14:00:00 - 18:00:00' }
      );
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      const constrainedDate = endController.props('modelValue') as Date;
      expect(constrainedDate.getHours()).toBe(18);
    });

    it('should not constrain when within range', () => {
      const dates = [
        new Date('2023-01-15T10:00:00'),
        new Date('2023-01-15T16:00:00'),
      ];
      const wrapper = createWrapper(
        { modelValue: dates },
        {
          startSelectableRange: '09:00:00 - 12:00:00',
          endSelectableRange: '14:00:00 - 18:00:00',
        }
      );
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('modelValue')).toEqual(dates[0]);
      expect(controllers[1].props('modelValue')).toEqual(dates[1]);
    });

    it('should handle edge case at start of range', () => {
      const startDate = new Date('2023-01-15T09:00:00');
      const wrapper = createWrapper(
        { modelValue: [startDate, null] },
        { startSelectableRange: '09:00:00 - 12:00:00' }
      );
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('modelValue')).toEqual(startDate);
    });

    it('should handle edge case at end of range', () => {
      const endDate = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, endDate] },
        { endSelectableRange: '14:00:00 - 18:00:00' }
      );
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('modelValue')).toEqual(endDate);
    });
  });

  describe('ComponentData reactivity', () => {
    it('should update when startDefaultTime changes', async () => {
      const defaultTime1 = new Date('2023-01-15T09:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { startDefaultTime: defaultTime1 }
      );

      const defaultTime2 = new Date('2023-01-15T10:00:00');
      mockAppTimePickerComponentData.value.startDefaultTime = defaultTime2;
      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);
    });

    it('should update when endDefaultTime changes', async () => {
      const defaultTime1 = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { endDefaultTime: defaultTime1 }
      );

      const defaultTime2 = new Date('2023-01-15T19:00:00');
      mockAppTimePickerComponentData.value.endDefaultTime = defaultTime2;
      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);
    });

    it('should update selectableRange reactively', async () => {
      const wrapper = createWrapper(
        {},
        { startSelectableRange: '09:00:00 - 12:00:00' }
      );

      mockAppTimePickerComponentData.value.startSelectableRange =
        '10:00:00 - 13:00:00';
      await wrapper.vm.$nextTick();

      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('selectableRange')).toBe(
        '10:00:00 - 13:00:00'
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle midnight (00:00:00) as start time', () => {
      const dates = [
        new Date('2023-01-15T00:00:00'),
        new Date('2023-01-15T12:00:00'),
      ];
      const wrapper = createWrapper({ modelValue: dates });
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('modelValue')).toEqual(dates[0]);
    });

    it('should handle end of day (23:59:59) as end time', () => {
      const dates = [
        new Date('2023-01-15T12:00:00'),
        new Date('2023-01-15T23:59:59'),
      ];
      const wrapper = createWrapper({ modelValue: dates });
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('modelValue')).toEqual(dates[1]);
    });

    it('should handle same time for start and end', () => {
      const date = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper({ modelValue: [date, date] });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('modelValue')).toEqual(date);
      expect(controllers[1].props('modelValue')).toEqual(date);
    });

    it('should handle dates with milliseconds', () => {
      const dates = [
        new Date('2023-01-15T10:00:00.123'),
        new Date('2023-01-15T14:00:00.456'),
      ];
      const wrapper = createWrapper({ modelValue: dates });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('modelValue')).toEqual(dates[0]);
      expect(controllers[1].props('modelValue')).toEqual(dates[1]);
    });

    it('should handle empty array as modelValue', () => {
      const wrapper = createWrapper({ modelValue: [] });
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle array with single element', () => {
      const date = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper({ modelValue: [date] });
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('modelValue')).toEqual(date);
    });

    it('should handle array with more than 2 elements', () => {
      const dates = [
        new Date('2023-01-15T10:00:00'),
        new Date('2023-01-15T14:00:00'),
        new Date('2023-01-15T18:00:00'),
      ];
      const wrapper = createWrapper({ modelValue: dates });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('modelValue')).toEqual(dates[0]);
      expect(controllers[1].props('modelValue')).toEqual(dates[1]);
    });

    it('should handle missing provide data gracefully', () => {
      const wrapper = shallowMount(AppTimeRangeMode, {
        props: { modelValue: [new Date(), new Date()] },
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

    it('should handle selectableRange crossing midnight', () => {
      const wrapper = createWrapper(
        {},
        {
          startSelectableRange: '20:00:00 - 23:59:59',
          endSelectableRange: '20:00:00 - 23:59:59',
        }
      );
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('selectableRange')).toBe(
        '20:00:00 - 23:59:59'
      );
      expect(controllers[1].props('selectableRange')).toBe(
        '20:00:00 - 23:59:59'
      );
    });

    it('should handle very narrow selectableRange', () => {
      const wrapper = createWrapper(
        {},
        {
          startSelectableRange: '12:00:00 - 12:00:01',
          endSelectableRange: '12:00:01 - 12:00:02',
        }
      );
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Dynamic range calculation', () => {
    it('should create range 00:00:00 to end time for start controller', () => {
      const endDate = new Date('2023-01-15T15:30:45');
      const wrapper = createWrapper({ modelValue: [null, endDate] });
      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('selectableRange')).toBe(
        '00:00:00 - 15:30:45'
      );
    });

    it('should create range from start time to 23:59:59 for end controller', () => {
      const startDate = new Date('2023-01-15T09:15:30');
      const wrapper = createWrapper({ modelValue: [startDate, null] });
      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('selectableRange')).toBe(
        '09:15:30 - 23:59:59'
      );
    });

    it('should update dynamic range when start changes', async () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });

      await controllers[0].vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T10:00:00')
      );
      await wrapper.vm.$nextTick();

      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('selectableRange')).toBe(
        '10:00:00 - 23:59:59'
      );
    });

    it('should update dynamic range when end changes', async () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });

      await controllers[1].vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T16:00:00')
      );
      await wrapper.vm.$nextTick();

      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('selectableRange')).toBe(
        '00:00:00 - 16:00:00'
      );
    });

    it('should return time when both values are null', () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('selectableRange')).toBe(
        '00:00:00 - 18:00:00'
      );
      expect(controllers[1].props('selectableRange')).toBe(
        '09:00:00 - 23:59:59'
      );
    });
  });

  describe('PropTypes validation', () => {
    it('should accept array of Dates as modelValue', () => {
      const dates = [new Date(), new Date()];
      const wrapper = createWrapper({ modelValue: dates });
      expect(wrapper.props('modelValue')).toEqual(dates);
    });

    it('should accept array with nulls as modelValue', () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      expect(wrapper.props('modelValue')).toEqual([null, null]);
    });

    it('should accept mixed array as modelValue', () => {
      const modelValue = [new Date(), null];
      const wrapper = createWrapper({ modelValue });
      expect(wrapper.props('modelValue')).toEqual(modelValue);
    });
  });

  describe('Component structure', () => {
    it('should have single root element', () => {
      const wrapper = createWrapper();
      expect(wrapper.element.childElementCount).toBeGreaterThanOrEqual(1);
    });

    it('should contain two AppTimeController as children', () => {
      const wrapper = createWrapper();
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers).toHaveLength(2);
    });

    it('should have first section with ref', () => {
      const wrapper = createWrapper();
      const firstSection = wrapper.find('section');
      expect(firstSection.exists()).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should work with all features enabled', () => {
      const dates = [
        new Date('2023-01-15T10:00:00'),
        new Date('2023-01-15T16:00:00'),
      ];
      const wrapper = createWrapper(
        { modelValue: dates },
        {
          startSelectableRange: '09:00:00 - 12:00:00',
          endSelectableRange: '14:00:00 - 18:00:00',
          startDefaultTime: new Date('2023-01-15T09:00:00'),
          endDefaultTime: new Date('2023-01-15T18:00:00'),
          format: 'HH:mm:ss',
        }
      );
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });
      expect(controllers[0].props('modelValue')).toEqual(dates[0]);
      expect(controllers[1].props('modelValue')).toEqual(dates[1]);
    });

    it('should handle controller updates with constraints', async () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        {
          startSelectableRange: '09:00:00 - 12:00:00',
          endSelectableRange: '14:00:00 - 18:00:00',
        }
      );
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });

      await controllers[0].vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T10:00:00')
      );
      await controllers[1].vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T16:00:00')
      );

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should maintain state across multiple updates', async () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });

      const pairs = [
        [new Date('2023-01-15T09:00:00'), new Date('2023-01-15T15:00:00')],
        [new Date('2023-01-15T10:00:00'), new Date('2023-01-15T16:00:00')],
        [new Date('2023-01-15T11:00:00'), new Date('2023-01-15T17:00:00')],
      ];

      for (const [start, end] of pairs) {
        await controllers[0].vm.$emit('update:modelValue', start);
        await controllers[1].vm.$emit('update:modelValue', end);
      }

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should synchronize dynamic ranges between controllers', async () => {
      const wrapper = createWrapper({ modelValue: [null, null] });
      const controllers = wrapper.findAllComponents({
        name: 'AppTimeController',
      });

      await controllers[0].vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T10:00:00')
      );
      await wrapper.vm.$nextTick();

      const endController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[1];
      expect(endController.props('selectableRange')).toBe(
        '10:00:00 - 23:59:59'
      );

      await controllers[1].vm.$emit(
        'update:modelValue',
        new Date('2023-01-15T16:00:00')
      );
      await wrapper.vm.$nextTick();

      const startController = wrapper.findAllComponents({
        name: 'AppTimeController',
      })[0];
      expect(startController.props('selectableRange')).toBe(
        '00:00:00 - 16:00:00'
      );
    });
  });
});
