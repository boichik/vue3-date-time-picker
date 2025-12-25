import { computed, nextTick, ref, type Ref } from 'vue';
import { AppTimePickerComponentDataProvide } from '../../../const';
import { shallowMount } from '@vue/test-utils';
import AppTimeInput from './AppTimeInput.vue';
import type { AppTimePickerComponentData } from '../../../interfaces/index.interface';
import ClockIcon from '@heroicons/vue/24/outline/ClockIcon';

const { focus, blur, remove } = vi.hoisted(() => ({
  focus: vi.fn(),
  blur: vi.fn(),
  remove: vi.fn(),
}));

type InternalComponentData = Partial<AppTimePickerComponentData>;

const defaultAppTimePickerComponentData: InternalComponentData = {
  disabled: false,
  readonly: false,
  inputReadonly: false,
  invalid: false,
  clearable: false,
  format: 'HH:mm:ss',
  placeholder: 'Select time',
  startPlaceholder: 'Start time',
  endPlaceholder: 'End time',
  isRange: false,
};

describe('AppTimeInput', () => {
  let mockAppTimePickerComponentData: Ref<InternalComponentData>;

  const createWrapper = (
    props?: Partial<InstanceType<typeof AppTimeInput>['$props']>,
    providedData?: InternalComponentData
  ) => {
    const mergedData = {
      ...mockAppTimePickerComponentData.value,
      ...providedData,
    };

    return shallowMount(AppTimeInput, {
      props: {
        modelValue: null,
        popoverVisible: false,
        ...props,
      },
      global: {
        provide: {
          [AppTimePickerComponentDataProvide]: computed(() => mergedData),
        },
        stubs: {
          AppDateInput: {
            name: 'AppDateInput',
            template: '<input />',
            props: [
              'modelValue',
              'format',
              'placeholder',
              'disabled',
              'readonly',
              'customId',
              'customName',
              'disabledDate',
            ],
            methods: {
              focus,
              blur,
              remove,
            },
          },
        },
      },
      slots: {
        separator: '<span id="custom-separator">to</span>',
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAppTimePickerComponentData = ref({
      ...defaultAppTimePickerComponentData,
    });
  });

  describe('Single Input (default mode)', () => {
    it('should render single AppDateInput for default mode', () => {
      const wrapper = createWrapper();
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs).toHaveLength(1);
    });

    it('should render ClockIcon when clearable is false', () => {
      const wrapper = createWrapper({}, { clearable: false });
      const icon = wrapper.findComponent(ClockIcon);
      expect(icon.exists()).toBe(true);
    });

    it('should not render clear button when clearable is false', () => {
      const wrapper = createWrapper({}, { clearable: false });

      const button = wrapper.find('button');
      expect(button.exists()).toBe(false);
    });

    it('should pass modelValue as single date to AppDateInput', () => {
      const date = new Date('2023-01-15T10:30:00');
      const wrapper = createWrapper({ modelValue: date });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('modelValue')).toEqual(date);
    });

    it('should pass null modelValue to AppDateInput', () => {
      const wrapper = createWrapper({ modelValue: null });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('modelValue')).toBeNull();
    });

    it('should emit update:model-value when single input value changes', async () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      const newDate = new Date('2023-02-20T14:45:30');

      await input.vm.$emit('update:model-value', newDate);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([newDate]);
    });

    it('should emit update:model-value with null', async () => {
      const wrapper = createWrapper({ modelValue: new Date() });
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      await input.vm.$emit('update:model-value', null);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([null]);
    });

    it('should pass correct format to single input', () => {
      const wrapper = createWrapper({}, { format: 'HH:mm' });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('format')).toBe('HH:mm');
    });

    it('should pass placeholder to single input', () => {
      const wrapper = createWrapper({}, { placeholder: 'Pick a time' });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('placeholder')).toBe('Pick a time');
    });

    it('should pass disabled prop to single input', () => {
      const wrapper = createWrapper({}, { disabled: true });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('disabled')).toBe(true);
    });

    it('should pass readonly prop to single input', () => {
      const wrapper = createWrapper({}, { readonly: true });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('readonly')).toBe(true);
    });

    it('should pass inputReadonly prop to single input', () => {
      const wrapper = createWrapper({}, { inputReadonly: true });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('readonly')).toBe(true);
    });

    it('should combine readonly and inputReadonly props', () => {
      const wrapper = createWrapper(
        {},
        { readonly: false, inputReadonly: true }
      );
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('readonly')).toBe(true);
    });

    it('should pass custom id and name attributes to single input', () => {
      const wrapper = createWrapper(
        {},
        { startId: 'time-id', startName: 'time-name' }
      );
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('customId')).toBe('time-id');
      expect(input.props('customName')).toBe('time-name');
    });

    it('should emit focus event when input is focused', async () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      await input.vm.$emit('focus');

      expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('should emit blur event when input is blurred', async () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      await input.vm.$emit('blur');

      expect(wrapper.emitted('blur')).toBeTruthy();
    });

    it('should not render separator for single input mode', () => {
      const wrapper = createWrapper({}, { isRange: false });
      const separator = wrapper.find('span');
      expect(separator.exists()).toBe(false);
    });

    it('should not render second AppDateInput for single mode', () => {
      const wrapper = createWrapper({}, { isRange: false });
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs).toHaveLength(1);
    });
  });

  describe('Double Inputs (range mode)', () => {
    it('should render two AppDateInput for range mode', () => {
      const wrapper = createWrapper({}, { isRange: true });
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs).toHaveLength(2);
    });

    it('should render separator for range mode', () => {
      const wrapper = createWrapper({}, { isRange: true });
      const separator = wrapper.find('span');
      expect(separator.exists()).toBe(true);
      expect(separator.text()).toBe('to');
    });

    it('should pass array values to start and end inputs', () => {
      const startDate = new Date('2023-01-15T10:00:00');
      const endDate = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [startDate, endDate] },
        { isRange: true }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });

      expect(inputs[0].props('modelValue')).toEqual(startDate);
      expect(inputs[1].props('modelValue')).toEqual(endDate);
    });

    it('should handle null values in array', () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { isRange: true }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });

      expect(inputs[0].props('modelValue')).toBeNull();
      expect(inputs[1].props('modelValue')).toBeNull();
    });

    it('should handle partial null values in array', () => {
      const startDate = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper(
        { modelValue: [startDate, null] },
        { isRange: true }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });

      expect(inputs[0].props('modelValue')).toEqual(startDate);
      expect(inputs[1].props('modelValue')).toBeNull();
    });

    it('should emit update:model-value with array when start input changes', async () => {
      const endDate = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, endDate] },
        { isRange: true }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];
      const newStartDate = new Date('2023-01-15T10:00:00');

      await startInput.vm.$emit('update:model-value', newStartDate);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([
        [newStartDate, endDate],
      ]);
    });

    it('should emit update:model-value with array when end input changes', async () => {
      const startDate = new Date('2023-01-15T10:00:00');
      const wrapper = createWrapper(
        { modelValue: [startDate, null] },
        { isRange: true }
      );
      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];
      const newEndDate = new Date('2023-01-15T18:00:00');

      await endInput.vm.$emit('update:model-value', newEndDate);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([
        [startDate, newEndDate],
      ]);
    });

    it('should sort dates when both are provided', async () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { isRange: true }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];
      const laterDate = new Date('2023-01-15T18:00:00');
      const earlierDate = new Date('2023-01-15T10:00:00');

      await startInput.vm.$emit('update:model-value', laterDate);
      await wrapper.setProps({ modelValue: [laterDate, null] });

      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];
      await endInput.vm.$emit('update:model-value', earlierDate);

      expect(wrapper.emitted('update:model-value')?.[1]).toEqual([
        [earlierDate, laterDate],
      ]);
    });

    it('should not sort if one value is null', async () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { isRange: true }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];
      const date = new Date('2023-01-15T18:00:00');

      await startInput.vm.$emit('update:model-value', date);

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([
        [date, null],
      ]);
    });

    it('should pass startPlaceholder to start input', () => {
      const wrapper = createWrapper(
        {},
        { isRange: true, startPlaceholder: 'Start' }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];
      expect(startInput.props('placeholder')).toBe('Start');
    });

    it('should pass endPlaceholder to end input', () => {
      const wrapper = createWrapper(
        {},
        { isRange: true, endPlaceholder: 'End' }
      );
      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];
      expect(endInput.props('placeholder')).toBe('End');
    });

    it('should pass disabled to both inputs', () => {
      const wrapper = createWrapper({}, { isRange: true, disabled: true });
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('disabled')).toBe(true);
      expect(inputs[1].props('disabled')).toBe(true);
    });

    it('should pass readonly to both inputs', () => {
      const wrapper = createWrapper({}, { isRange: true, readonly: true });
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('readonly')).toBe(true);
      expect(inputs[1].props('readonly')).toBe(true);
    });

    it('should pass format to both inputs', () => {
      const wrapper = createWrapper({}, { isRange: true, format: 'HH:mm' });
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('format')).toBe('HH:mm');
      expect(inputs[1].props('format')).toBe('HH:mm');
    });

    it('should pass custom ids to both inputs', () => {
      const wrapper = createWrapper(
        {},
        { isRange: true, startId: 'start-id', endId: 'end-id' }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('customId')).toBe('start-id');
      expect(inputs[1].props('customId')).toBe('end-id');
    });

    it('should pass custom names to both inputs', () => {
      const wrapper = createWrapper(
        {},
        { isRange: true, startName: 'start-name', endName: 'end-name' }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('customName')).toBe('start-name');
      expect(inputs[1].props('customName')).toBe('end-name');
    });

    it('should emit focus when separator is clicked', async () => {
      const wrapper = createWrapper({}, { isRange: true });

      const divs = wrapper.findAll('div');

      expect(divs).toHaveLength(3);
      const separator = divs[1];

      await separator.trigger('click');

      expect(wrapper.emitted('focus')).toBeTruthy();
    });
  });

  describe('Clearable functionality', () => {
    it('should show ClockIcon when not clearable', () => {
      const wrapper = createWrapper({}, { clearable: false });
      const clockIcon = wrapper.findComponent(ClockIcon);
      expect(clockIcon.exists()).toBe(true);
    });

    it('should show clear button when clearable and has value', () => {
      const wrapper = createWrapper(
        { modelValue: new Date() },
        { clearable: true }
      );
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
    });

    it('should not show clear button when clearable but no value', () => {
      const wrapper = createWrapper({ modelValue: null }, { clearable: true });
      const button = wrapper.find('button');
      expect(button.exists()).toBe(false);
    });

    it('should emit update:model-value with null when clear button clicked', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date() },
        { clearable: true }
      );
      const button = wrapper.find('button');

      await button.trigger('click');

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([null]);
    });

    it('should emit clear event when clear button clicked', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date() },
        { clearable: true }
      );
      const button = wrapper.find('button');

      await button.trigger('click');

      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('should emit update:model-value with array of nulls for range mode', async () => {
      const wrapper = createWrapper(
        { modelValue: [new Date(), new Date()] },
        { clearable: true, isRange: true }
      );
      const button = wrapper.find('button');

      await button.trigger('click');

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([
        [null, null],
      ]);
    });

    it('should show clear button when start date has value in range mode', () => {
      const wrapper = createWrapper(
        { modelValue: [new Date(), null] },
        { clearable: true, isRange: true }
      );
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
    });

    it('should show clear button when end date has value in range mode', () => {
      const wrapper = createWrapper(
        { modelValue: [null, new Date()] },
        { clearable: true, isRange: true }
      );
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
    });

    it('should not show clear button when both dates are null in range mode', () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { clearable: true, isRange: true }
      );
      const button = wrapper.find('button');
      expect(button.exists()).toBe(false);
    });
  });

  describe('Focus and Blur events', () => {
    it('should emit focus when start input is focused', async () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      await input.vm.$emit('focus');

      expect(wrapper.emitted('focus')).toBeTruthy();
      expect(wrapper.emitted('focus')).toHaveLength(1);
    });

    it('should emit blur when start input is blurred', async () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      await input.vm.$emit('blur');

      expect(wrapper.emitted('blur')).toBeTruthy();
      expect(wrapper.emitted('blur')).toHaveLength(1);
    });

    it('should emit focus when start input is focused in range mode', async () => {
      const wrapper = createWrapper({}, { isRange: true });
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];

      await startInput.vm.$emit('focus');

      expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('should emit blur when start input is blurred in range mode', async () => {
      const wrapper = createWrapper({}, { isRange: true });
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];

      await startInput.vm.$emit('blur');

      expect(wrapper.emitted('blur')).toBeTruthy();
    });

    it('should emit focus when end input is focused in range mode', async () => {
      const wrapper = createWrapper({}, { isRange: true });
      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];

      await endInput.vm.$emit('focus');

      expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('should emit blur when end input is blurred in range mode', async () => {
      const wrapper = createWrapper({}, { isRange: true });
      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];

      await endInput.vm.$emit('blur');

      expect(wrapper.emitted('blur')).toBeTruthy();
    });
  });

  describe('DisabledDate validation', () => {
    it('should pass disabledDate function to start input', () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('disabledDate')).toBeDefined();
      expect(typeof input.props('disabledDate')).toBe('function');
    });

    it('should pass disabledDate function to both inputs in range mode', () => {
      const wrapper = createWrapper({}, { isRange: true });
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('disabledDate')).toBeDefined();
      expect(inputs[1].props('disabledDate')).toBeDefined();
    });

    it('should validate with custom isDisabledDate function', () => {
      const isDisabledDate = vi.fn(() => true);
      const wrapper = createWrapper({}, { isDisabledDate });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      const disabledDateFn = input.props('disabledDate');

      const result = disabledDateFn(new Date());

      expect(result).toBe(true);
    });

    it('should validate with selectableRange', () => {
      const wrapper = createWrapper(
        {},
        { selectableRange: '10:00:00 - 18:00:00' }
      );
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      const disabledDateFn = input.props('disabledDate');

      const validTime = new Date('2023-01-15T14:00:00');
      const invalidTime = new Date('2023-01-15T20:00:00');

      expect(disabledDateFn(validTime)).toBe(false);
      expect(disabledDateFn(invalidTime)).toBe(true);
    });

    it('should return true for non-date values', () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      const disabledDateFn = input.props('disabledDate');

      expect(disabledDateFn('invalid')).toBe(true);
      expect(disabledDateFn(null)).toBe(true);
      expect(disabledDateFn(undefined)).toBe(true);
      expect(disabledDateFn(123)).toBe(true);
    });

    it('should validate with startSelectableRange in range mode', () => {
      const wrapper = createWrapper(
        {},
        { isRange: true, startSelectableRange: '09:00:00 - 12:00:00' }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];
      const disabledDateFn = startInput.props('disabledDate');

      const validTime = new Date('2023-01-15T10:00:00');
      const invalidTime = new Date('2023-01-15T14:00:00');

      expect(disabledDateFn(validTime)).toBe(false);
      expect(disabledDateFn(invalidTime)).toBe(true);
    });

    it('should validate with endSelectableRange in range mode', () => {
      const wrapper = createWrapper(
        {},
        { isRange: true, endSelectableRange: '14:00:00 - 18:00:00' }
      );
      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];
      const disabledDateFn = endInput.props('disabledDate');

      const validTime = new Date('2023-01-15T15:00:00');
      const invalidTime = new Date('2023-01-15T20:00:00');

      expect(disabledDateFn(validTime)).toBe(false);
      expect(disabledDateFn(invalidTime)).toBe(true);
    });

    it('should create dynamic range from modelValue in range mode', () => {
      const endDate = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, endDate] },
        { isRange: true }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];
      const disabledDateFn = startInput.props('disabledDate');

      const validTime = new Date('2023-01-15T10:00:00');
      const invalidTime = new Date('2023-01-15T20:00:00');

      expect(disabledDateFn(validTime)).toBe(false);
      expect(disabledDateFn(invalidTime)).toBe(true);
    });
  });

  describe('Exposed methods', () => {
    it('should expose focus method', () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.focus).toBeDefined();
      expect(typeof wrapper.vm.focus).toBe('function');
    });

    it('should expose blur method', () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.blur).toBeDefined();
      expect(typeof wrapper.vm.blur).toBe('function');
    });

    it('should expose remove method', () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.remove).toBeDefined();
      expect(typeof wrapper.vm.remove).toBe('function');
    });

    it('should call remove and emit events', async () => {
      const wrapper = createWrapper({ modelValue: new Date() });

      wrapper.vm.remove();
      await nextTick();

      expect(remove).toHaveBeenCalled();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('should remove with array in range mode', async () => {
      const wrapper = createWrapper(
        { modelValue: [new Date(), new Date()] },
        { isRange: true }
      );

      wrapper.vm.remove();
      await nextTick();

      expect(remove).toHaveBeenCalled();

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([
        [null, null],
      ]);
    });

    it('should focus the input element', () => {
      const wrapper = createWrapper();
      wrapper.vm.focus();
      expect(focus).toHaveBeenCalled();
    });

    it('should blur the input element', () => {
      const wrapper = createWrapper();
      wrapper.vm.blur();
      expect(blur).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined modelValue', () => {
      const wrapper = createWrapper({ modelValue: undefined });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('modelValue')).toBeUndefined();
    });

    it('should handle invalid date in modelValue', async () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      await input.vm.$emit('update:model-value', new Date('invalid'));

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
    });

    it('should handle empty array in range mode', () => {
      const wrapper = createWrapper({ modelValue: [] }, { isRange: true });
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('modelValue')).toBeUndefined();
      expect(inputs[1].props('modelValue')).toBeUndefined();
    });

    it('should handle array with more than 2 elements', () => {
      const dates = [new Date(), new Date(), new Date()];
      const wrapper = createWrapper({ modelValue: dates }, { isRange: true });
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('modelValue')).toEqual(dates[0]);
      expect(inputs[1].props('modelValue')).toEqual(dates[1]);
    });

    it('should handle missing provide data gracefully', () => {
      const wrapper = shallowMount(AppTimeInput, {
        props: { modelValue: null, popoverVisible: false },
        global: {
          stubs: {
            AppDateInput: {
              name: 'AppDateInput',
              template: '<input />',
            },
          },
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should handle selectableRange without valid format', () => {
      const wrapper = createWrapper({}, { selectableRange: 'invalid' });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      const disabledDateFn = input.props('disabledDate');

      expect(disabledDateFn(new Date())).toBe(false);
    });

    it('should handle same start and end dates', async () => {
      const date = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: [date, date] },
        { isRange: true }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });

      expect(inputs[0].props('modelValue')).toEqual(date);
      expect(inputs[1].props('modelValue')).toEqual(date);
    });

    it('should not crash with null in provide data', () => {
      const wrapper = shallowMount(AppTimeInput, {
        props: { modelValue: null, popoverVisible: false },
        global: {
          provide: {
            [AppTimePickerComponentDataProvide]: null,
          },
          stubs: {
            AppDateInput: { name: 'AppDateInput', template: '<input />' },
          },
        },
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('PopoverVisible prop', () => {
    it('should accept popoverVisible prop', () => {
      const wrapper = createWrapper({ popoverVisible: true });
      expect(wrapper.props('popoverVisible')).toBe(true);
    });

    it('should handle popoverVisible false', () => {
      const wrapper = createWrapper({ popoverVisible: false });
      expect(wrapper.props('popoverVisible')).toBe(false);
    });

    it('should update popoverVisible reactively', async () => {
      const wrapper = createWrapper({ popoverVisible: false });
      expect(wrapper.props('popoverVisible')).toBe(false);

      await wrapper.setProps({ popoverVisible: true });
      expect(wrapper.props('popoverVisible')).toBe(true);
    });
  });

  describe('Component data attributes', () => {
    it('should pass all startId, endId, startName, endName in range mode', () => {
      const wrapper = createWrapper(
        {},
        {
          isRange: true,
          startId: 's-id',
          endId: 'e-id',
          startName: 's-name',
          endName: 'e-name',
        }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });

      expect(inputs[0].props('customId')).toBe('s-id');
      expect(inputs[0].props('customName')).toBe('s-name');
      expect(inputs[1].props('customId')).toBe('e-id');
      expect(inputs[1].props('customName')).toBe('e-name');
    });

    it('should handle undefined id and name attributes', () => {
      const wrapper = createWrapper(
        {},
        { startId: undefined, startName: undefined }
      );
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      expect(input.props('customId')).toBeUndefined();
      expect(input.props('customName')).toBeUndefined();
    });

    it('should handle empty string id and name', () => {
      const wrapper = createWrapper({}, { startId: '', startName: '' });
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      expect(input.props('customId')).toBe('');
      expect(input.props('customName')).toBe('');
    });
  });

  describe('Separator slot', () => {
    it('should render separator slot content in range mode', () => {
      const wrapper = createWrapper({}, { isRange: true });
      const separator = wrapper.find('#custom-separator');

      expect(separator.exists()).toBe(true);
      expect(separator.text()).toBe('to');
    });

    it('should handle empty separator slot', () => {
      const wrapper = shallowMount(AppTimeInput, {
        props: { modelValue: null, popoverVisible: false },
        global: {
          provide: {
            [AppTimePickerComponentDataProvide]: computed(() => ({
              ...defaultAppTimePickerComponentData,
              isRange: true,
            })),
          },
          stubs: {
            AppDateInput: { name: 'AppDateInput', template: '<input />' },
          },
        },
      });

      const divs = wrapper.findAll('div');
      const separator = divs[1];
      expect(separator.exists()).toBe(true);
    });
  });

  describe('Date sorting logic', () => {
    it('should keep original order if dates are already sorted', async () => {
      const earlierDate = new Date('2023-01-15T10:00:00');
      const laterDate = new Date('2023-01-15T18:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { isRange: true }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];

      await startInput.vm.$emit('update:model-value', earlierDate);
      await wrapper.setProps({ modelValue: [earlierDate, null] });

      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];
      await endInput.vm.$emit('update:model-value', laterDate);

      expect(wrapper.emitted('update:model-value')?.[1]).toEqual([
        [earlierDate, laterDate],
      ]);
    });

    it('should handle equal timestamps', async () => {
      const date1 = new Date('2023-01-15T12:00:00');
      const date2 = new Date('2023-01-15T12:00:00');
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { isRange: true }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];

      await startInput.vm.$emit('update:model-value', date1);
      await wrapper.setProps({ modelValue: [date1, null] });

      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];
      await endInput.vm.$emit('update:model-value', date2);

      const emitted = wrapper.emitted('update:model-value')?.[1]?.[0] as Date[];
      expect(+emitted[0]).toBe(+date1);
      expect(+emitted[1]).toBe(+date2);
    });
  });
});
