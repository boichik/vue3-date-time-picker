import { shallowMount, flushPromises } from '@vue/test-utils';
import { defineComponent, inject, computed, nextTick } from 'vue';
import AppTimeContent from './AppTimeContent.vue';
import AppButtonPanel from '@/ui/AppButtonPanel/Index.vue';
import {
  AppTimePickerComponentDataProvide,
  AppTimeRangeModeState,
} from '../../../const';
import type { AppTimePickerComponentData } from '../../../interfaces/index.interface';

describe('AppTimeContent', () => {
  let injectedAppTimeRangeModeState: {
    isCompact: boolean;
    step: 'start' | 'end';
    next: () => void;
  } | null;

  beforeEach(() => {
    vi.clearAllMocks();

    injectedAppTimeRangeModeState = null;
  });

  const AppTimeRangeMode = defineComponent({
    name: 'AppTimeRangeMode',
    // @eslint-disable-next-line vue/require-prop-types
    props: ['modelValue'],
    setup() {
      injectedAppTimeRangeModeState = inject(AppTimeRangeModeState, null);

      return {};
    },
    template: '<div></div>',
  });

  const createWrapper = (
    props = {},
    componentDataOverrides: Partial<AppTimePickerComponentData> = {}
  ) => {
    const defaultComponentData = computed<Partial<AppTimePickerComponentData>>(
      () => ({
        isRange: false,
        clearable: true,
        format: 'HH:mm:ss',
        placeholder: 'Select time',
        cancelText: 'Cancel',
        applyText: 'Apply',
        nextText: 'Next',
        selectableRange: undefined,
        startDefaultTime: new Date('2024-01-01T10:00:00'),
        endDefaultTime: new Date('2024-01-01T18:00:00'),
        disabledApplyButton: false,
        applyChange: vi.fn(),
        cancelChange: vi.fn(),
        isDisabledDate: undefined,
        ...componentDataOverrides,
      })
    );

    return shallowMount(AppTimeContent, {
      props: {
        modelValue: null,
        ...props,
      },
      global: {
        provide: {
          [AppTimePickerComponentDataProvide]: defaultComponentData,
        },
        stubs: {
          AppTimeRangeMode,
        },
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render AppButtonPanel', () => {
      const wrapper = createWrapper();
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      expect(buttonPanel.exists()).toBe(true);
    });

    it('should render AppTimeDefaultMode when isRange is false', () => {
      const wrapper = createWrapper();
      const defaultMode = wrapper.findComponent({ name: 'AppTimeDefaultMode' });

      expect(defaultMode.exists()).toBe(true);
    });

    it('should render AppTimeRangeMode when isRange is true', () => {
      const wrapper = createWrapper({}, { isRange: true });
      const rangeMode = wrapper.findComponent({ name: 'AppTimeRangeMode' });
      console.log(wrapper.html());
      expect(rangeMode.exists()).toBe(true);
    });

    it('should not render AppTimeDefaultMode when isRange is true', () => {
      const wrapper = createWrapper({}, { isRange: true });
      const defaultMode = wrapper.findComponent({ name: 'AppTimeDefaultMode' });

      expect(defaultMode.exists()).toBe(false);
    });

    it('should not render AppTimeRangeMode when isRange is false', () => {
      const wrapper = createWrapper();
      const rangeMode = wrapper.findComponent({ name: 'AppTimeRangeMode' });

      expect(rangeMode.exists()).toBe(false);
    });
  });

  describe('Props Passing to AppButtonPanel', () => {
    it('should pass cancelText to AppButtonPanel', () => {
      const wrapper = createWrapper({}, { cancelText: 'Dismiss' });
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      expect(buttonPanel.props('cancelText')).toBe('Dismiss');
    });

    it('should pass applyText to AppButtonPanel', () => {
      const wrapper = createWrapper({}, { applyText: 'Confirm' });
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      expect(buttonPanel.props('applyText')).toBe('Confirm');
    });

    it('should pass disabledApplyButton to AppButtonPanel', () => {
      const wrapper = createWrapper({}, { disabledApplyButton: true });
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      expect(buttonPanel.props('disabled')).toBe(true);
    });

    it('should pass false for disabled when disabledApplyButton is false', () => {
      const wrapper = createWrapper({}, { disabledApplyButton: false });
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      expect(buttonPanel.props('disabled')).toBe(false);
    });
  });

  describe('ModelValue Binding', () => {
    it('should bind modelValue to mode component', () => {
      const date = new Date('2024-01-01T10:00:00');
      const wrapper = createWrapper({ modelValue: date });
      const defaultMode = wrapper.findComponent({ name: 'AppTimeDefaultMode' });

      expect(defaultMode.props('modelValue')).toEqual(date);
    });

    it('should bind array modelValue to range mode', () => {
      const dates = [
        new Date('2024-01-01T10:00:00'),
        new Date('2024-01-01T18:00:00'),
      ];
      const wrapper = createWrapper({ modelValue: dates }, { isRange: true });
      const rangeMode = wrapper.findComponent({ name: 'AppTimeRangeMode' });

      expect(rangeMode.props('modelValue')).toEqual(dates);
    });

    it('should update modelValue when mode component emits update', async () => {
      const wrapper = createWrapper();
      const defaultMode = wrapper.findComponent({ name: 'AppTimeDefaultMode' });
      const newDate = new Date('2024-01-01T15:00:00');

      await defaultMode.vm.$emit('update:modelValue', newDate);
      await flushPromises();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([newDate]);
    });

    it('should handle null modelValue', () => {
      const wrapper = createWrapper({ modelValue: null });
      const defaultMode = wrapper.findComponent({ name: 'AppTimeDefaultMode' });

      expect(defaultMode.props('modelValue')).toBeNull();
    });
  });

  describe('Button Click Events', () => {
    it('should call applyChange on apply button click', async () => {
      const applyChange = vi.fn();
      const wrapper = createWrapper({}, { applyChange });
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      await buttonPanel.vm.$emit('apply');

      expect(applyChange).toHaveBeenCalled();
    });

    it('should call cancelChange on cancel button click', async () => {
      const cancelChange = vi.fn();
      const wrapper = createWrapper({}, { cancelChange });
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      await buttonPanel.vm.$emit('cancel');

      expect(cancelChange).toHaveBeenCalled();
    });

    it('should not throw error when applyChange is undefined', async () => {
      const wrapper = createWrapper({}, { applyChange: undefined });
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      expect(() => buttonPanel.vm.$emit('apply')).not.toThrow();
    });

    it('should not throw error when cancelChange is undefined', async () => {
      const wrapper = createWrapper({}, { cancelChange: undefined });
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      expect(() => buttonPanel.vm.$emit('cancel')).not.toThrow();
    });
  });

  describe('Range Mode State Management', () => {
    it('should show applyText when not in compact mode', () => {
      const wrapper = createWrapper({}, { isRange: true, applyText: 'Apply' });
      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });

      expect(buttonPanel.props('applyText')).toBe('Apply');
    });

    it('should show nextText when in compact mode at start step', async () => {
      const wrapper = createWrapper(
        {},
        { isRange: true, nextText: 'Next', applyText: 'Apply' }
      );

      expect(injectedAppTimeRangeModeState).toBeDefined();

      injectedAppTimeRangeModeState!.isCompact = true;
      injectedAppTimeRangeModeState!.step = 'start';

      await nextTick();

      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });
      expect(buttonPanel.props('applyText')).toBe('Next');
    });

    it('should show applyText when in compact mode at end step', async () => {
      const wrapper = createWrapper(
        {},
        { isRange: true, nextText: 'Next', applyText: 'Apply' }
      );

      expect(injectedAppTimeRangeModeState).toBeDefined();

      injectedAppTimeRangeModeState!.isCompact = true;
      injectedAppTimeRangeModeState!.step = 'end';

      await nextTick();

      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });
      expect(buttonPanel.props('applyText')).toBe('Apply');
    });

    it('should call next function when clicking apply in compact start step', async () => {
      const applyChange = vi.fn();
      const next = vi.fn();
      const wrapper = createWrapper({}, { isRange: true, applyChange });

      expect(injectedAppTimeRangeModeState).toBeDefined();

      injectedAppTimeRangeModeState!.isCompact = true;
      injectedAppTimeRangeModeState!.step = 'start';
      injectedAppTimeRangeModeState!.next = next;

      await nextTick();

      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });
      await buttonPanel.vm.$emit('apply');

      expect(next).toHaveBeenCalled();
      expect(applyChange).not.toHaveBeenCalled();
    });

    it('should call applyChange when clicking apply in compact end step', async () => {
      const applyChange = vi.fn();
      const next = vi.fn();
      const wrapper = createWrapper({}, { isRange: true, applyChange });

      expect(injectedAppTimeRangeModeState).toBeDefined();

      injectedAppTimeRangeModeState!.isCompact = true;
      injectedAppTimeRangeModeState!.step = 'end';
      injectedAppTimeRangeModeState!.next = next;

      await nextTick();

      const buttonPanel = wrapper.findComponent({ name: 'AppButtonPanel' });
      await buttonPanel.vm.$emit('apply');

      expect(applyChange).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle modelValue update to null', async () => {
      const wrapper = createWrapper({ modelValue: new Date() });

      await wrapper.setProps({ modelValue: null });
      await flushPromises();

      const defaultMode = wrapper.findComponent({ name: 'AppTimeDefaultMode' });
      expect(defaultMode.props('modelValue')).toBeNull();
    });

    it('should handle modelValue update to different date', async () => {
      const date1 = new Date('2024-01-01T10:00:00');
      const date2 = new Date('2024-01-01T15:00:00');
      const wrapper = createWrapper({ modelValue: date1 });

      await wrapper.setProps({ modelValue: date2 });
      await flushPromises();

      const defaultMode = wrapper.findComponent({ name: 'AppTimeDefaultMode' });
      expect(defaultMode.props('modelValue')).toEqual(date2);
    });

    it('should handle range modelValue with null values', () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { isRange: true }
      );
      const rangeMode = wrapper.findComponent(AppTimeRangeMode);

      expect(rangeMode.props('modelValue')).toEqual([null, null]);
    });

    it('should handle range modelValue with partial null', () => {
      const date = new Date('2024-01-01T10:00:00');
      const wrapper = createWrapper(
        { modelValue: [date, null] },
        { isRange: true }
      );
      const rangeMode = wrapper.findComponent(AppTimeRangeMode);

      expect(rangeMode.props('modelValue')).toEqual([date, null]);
    });

    it('should handle rapid apply button clicks', async () => {
      const applyChange = vi.fn();
      const wrapper = createWrapper({}, { applyChange });
      const buttonPanel = wrapper.findComponent(AppButtonPanel);

      await buttonPanel.vm.$emit('apply');
      await buttonPanel.vm.$emit('apply');
      await buttonPanel.vm.$emit('apply');

      expect(applyChange).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid cancel button clicks', async () => {
      const cancelChange = vi.fn();
      const wrapper = createWrapper({}, { cancelChange });
      const buttonPanel = wrapper.findComponent(AppButtonPanel);

      await buttonPanel.vm.$emit('cancel');
      await buttonPanel.vm.$emit('cancel');
      await buttonPanel.vm.$emit('cancel');

      expect(cancelChange).toHaveBeenCalledTimes(3);
    });

    it('should handle nextText being undefined', async () => {
      const wrapper = createWrapper(
        {},
        { isRange: true, nextText: undefined, applyText: 'Apply' }
      );

      expect(injectedAppTimeRangeModeState).toBeDefined();

      injectedAppTimeRangeModeState!.isCompact = true;
      injectedAppTimeRangeModeState!.step = 'start';
      await nextTick();

      const buttonPanel = wrapper.findComponent(AppButtonPanel);
      expect(buttonPanel.props('applyText')).toBeUndefined();
    });

    it('should handle empty string for button texts', () => {
      const wrapper = createWrapper({}, { cancelText: '', applyText: '' });
      const buttonPanel = wrapper.findComponent(AppButtonPanel);

      expect(buttonPanel.props('cancelText')).toBe('');
      expect(buttonPanel.props('applyText')).toBe('');
    });
  });
});
