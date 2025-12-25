import { shallowMount } from '@vue/test-utils';
import AppDateTimeContent from './AppDateTimeContent.vue';
import { nextTick, ref, type Ref } from 'vue';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerModel,
} from '../../../interfaces/index.interface';
import { AppDateTimePickerComponentDataProvide } from '../../../const';
import { AppDateTimePickerType } from '../../../enums/dateTimePickerType';
import {
  initResizeObserverMock,
  observe,
  disconnect,
  instances,
  triggerResizeObserver,
} from '@tests/mocks/ResizeObserverMock';

type InternalComponentData = Partial<AppDateTimePickerComponentData>;

const { applyChange, cancelChange } = vi.hoisted(() => ({
  applyChange: vi.fn(),
  cancelChange: vi.fn(),
}));

const defaultAppDateTimePickerComponentData: InternalComponentData = {
  cancelText: 'cancel',
  applyText: 'apply',
  disabledApplyButton: false,
  shortcuts: [],
  type: AppDateTimePickerType.DateTime,
  applyChange,
  cancelChange,
};

describe('AppDateTimeContent', () => {
  let mockAppDateTimePickerComponentData: Ref<InternalComponentData>;

  const createWrapper = (
    props?: InstanceType<typeof AppDateTimeContent>['$props']
  ) =>
    shallowMount(AppDateTimeContent, {
      props,
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]:
            mockAppDateTimePickerComponentData,
        },
        stubs: {
          AppDateMode: true,
          AppDateRangeMode: true,
          AppButtonPanel: true,
          AppDateTimeShortcutPanel: true,
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();

    initResizeObserverMock();

    mockAppDateTimePickerComponentData = ref({
      ...defaultAppDateTimePickerComponentData,
    });
  });

  it('component should be displayed correctly', () => {
    const wrapper = createWrapper();

    expect(wrapper.exists()).toBe(true);

    const AppDateTimeShortcutPanel = wrapper.findComponent({
      name: 'AppDateTimeShortcutPanel',
    });
    expect(AppDateTimeShortcutPanel.exists()).toBe(false);
    const AppDateMode = wrapper.findComponent({ name: 'AppDateMode' });
    expect(AppDateMode.exists()).toBe(true);

    const AppButtonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });
    expect(AppButtonPanel.exists()).toBe(true);
  });

  it('ResizeObserver should be called on mounted', () => {
    expect(instances.length).toBe(0);

    createWrapper();

    expect(instances.length).toBe(1);
    expect(observe).toHaveBeenCalledTimes(1);
  });

  it('ResizeObserver should be disconnected on unmounted', () => {
    const wrapper = createWrapper();

    expect(instances.length).toBe(1);
    expect(disconnect).toHaveBeenCalledTimes(0);

    wrapper.unmount();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('should display shortcut panel when shortcuts are provided', async () => {
    mockAppDateTimePickerComponentData.value = {
      ...mockAppDateTimePickerComponentData.value,
      shortcuts: [
        {
          text: 'Today',
          value: null,
        },
      ],
    };

    const wrapper = createWrapper();

    const AppDateTimeShortcutPanel = wrapper.findComponent({
      name: 'AppDateTimeShortcutPanel',
    });

    expect(AppDateTimeShortcutPanel.exists()).toBe(true);

    expect(AppDateTimeShortcutPanel.attributes('style')).toBe(
      'max-height: 0px;'
    );
  });

  it('should update shortcuts style when ResizeObserver triggers', async () => {
    mockAppDateTimePickerComponentData.value = {
      ...defaultAppDateTimePickerComponentData,
      shortcuts: [
        {
          text: 'Today',
          value: null,
        },
      ],
    };

    const wrapper = createWrapper();

    const pickerElement = wrapper.find({ ref: 'picker' }).element;

    Object.defineProperty(pickerElement, 'offsetHeight', {
      configurable: true,
      value: 350,
    });

    triggerResizeObserver();

    await nextTick();

    const AppDateTimeShortcutPanel = wrapper.findComponent({
      name: 'AppDateTimeShortcutPanel',
    });

    expect(AppDateTimeShortcutPanel.attributes('style')).toBe(
      'max-height: 350px;'
    );
  });

  it('should emit a value when shortcut is selected', async () => {
    const shortcutValue = new Date(2025, 0, 1);

    mockAppDateTimePickerComponentData.value = {
      ...mockAppDateTimePickerComponentData.value,
      type: AppDateTimePickerType.Date,
      shortcuts: [
        {
          text: 'New Year 2024',
          value: shortcutValue,
        },
      ],
    };

    const wrapper = createWrapper();

    const AppDateTimeShortcutPanel = wrapper.findComponent({
      name: 'AppDateTimeShortcutPanel',
    });

    await AppDateTimeShortcutPanel.vm.$emit('select', shortcutValue);

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([shortcutValue]);
  });

  it.each([
    [AppDateTimePickerType.DateTime, 'AppDateMode', null, new Date(2025, 0, 1)],
    [AppDateTimePickerType.Date, 'AppDateMode', null, new Date(2025, 0, 1)],
    [
      AppDateTimePickerType.DateRange,
      'AppDateRangeMode',
      [null, null],
      [new Date(2025, 0, 1), new Date(2025, 0, 15)],
    ],
    [
      AppDateTimePickerType.DateTimeRange,
      'AppDateRangeMode',
      [null, null],
      [new Date(2025, 0, 1), new Date(2025, 0, 15)],
    ],
  ])(
    'should render correct mode component for type %s',
    async (type, componentName, modelValue, emittedValue) => {
      mockAppDateTimePickerComponentData.value = {
        ...mockAppDateTimePickerComponentData.value,
        type: type as AppDateTimePickerType,
      };

      const wrapper = createWrapper({
        modelValue: modelValue as never as AppDateTimePickerModel,
      });

      const modeComponent = wrapper.findComponent({ name: componentName });

      expect(modeComponent.exists()).toBe(true);

      expect(modeComponent.props('modelValue')).toEqual(modelValue);

      await modeComponent.vm.$emit('update:modelValue', emittedValue);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([emittedValue]);
    }
  );

  it('should correctly transfer props to the AppButtonPanel component', () => {
    const wrapper = createWrapper();

    const AppButtonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

    expect(AppButtonPanel.exists()).toBe(true);

    expect(AppButtonPanel.props('applyText')).toBe('apply');
    expect(AppButtonPanel.props('cancelText')).toBe('cancel');
    expect(AppButtonPanel.props('disabled')).toBe(false);
  });

  it('should call applyChange and cancelChange methods on button clicks', async () => {
    const wrapper = createWrapper();

    const AppButtonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

    expect(AppButtonPanel.exists()).toBe(true);

    await AppButtonPanel.vm.$emit('apply');

    expect(applyChange).toHaveBeenCalledTimes(1);

    await AppButtonPanel.vm.$emit('cancel');

    expect(cancelChange).toHaveBeenCalledTimes(1);
  });
});
