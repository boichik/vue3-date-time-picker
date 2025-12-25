import { computed, ref, type Ref } from 'vue';
import { AppDateTimePickerComponentDataProvide } from '../../../const';
import { shallowMount } from '@vue/test-utils';
import AppDateTimeInput from './AppDateTimeInput.vue';
import type { AppDateTimePickerComponentData } from '../../../interfaces/index.interface';
import { AppDateTimePickerType } from '../../../enums/dateTimePickerType';
import CalendarDaysIcon from '@heroicons/vue/16/solid/CalendarDaysIcon';

const { focus, blur, remove } = vi.hoisted(() => ({
  focus: vi.fn(),
  blur: vi.fn(),
  remove: vi.fn(),
}));

type InternalComponentData = Partial<AppDateTimePickerComponentData>;

const defaultAppDateTimePickerComponentData: InternalComponentData = {
  type: AppDateTimePickerType.Date,
  disabled: false,
  readonly: false,
  inputReadonly: false,
  invalid: false,
  clearable: false,
  dateFormat: 'yyyy-MM-dd',
  timeFormat: 'HH:mm',
  combineFormats: true,
  placeholder: 'Select date',
  startPlaceholder: 'Start date',
  endPlaceholder: 'End date',
};

describe('AppDateTimeInput', () => {
  let mockAppDateTimePickerComponentData: Ref<InternalComponentData>;

  const createWrapper = (
    props?: Partial<InstanceType<typeof AppDateTimeInput>['$props']>,
    providedData?: InternalComponentData
  ) => {
    const mergedData = {
      ...mockAppDateTimePickerComponentData.value,
      ...providedData,
    };

    return shallowMount(AppDateTimeInput, {
      props: {
        modelValue: null,
        ...props,
      },
      global: {
        provide: {
          [AppDateTimePickerComponentDataProvide]: computed(() => mergedData),
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
            methods: { focus, blur, remove },
          },
        },
      },
      slots: {
        separator: '<p class="custom-separator">separator</p>',
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAppDateTimePickerComponentData = ref({
      ...defaultAppDateTimePickerComponentData,
    });
  });

  describe('Single Input (date type)', () => {
    it('should render single AppDateInput for date type', () => {
      const wrapper = createWrapper();
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs).toHaveLength(1);
    });

    it('should pass modelValue as single date to AppDateInput', () => {
      const date = new Date('2023-01-15');
      const wrapper = createWrapper({ modelValue: date });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('modelValue')).toEqual(date);
    });

    it('should emit update:model-value when single input value changes', async () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      const newDate = new Date('2023-02-20');

      await input.vm.$emit('update:model-value', newDate);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([newDate]);
    });

    it('should pass correct format to single input', () => {
      const wrapper = createWrapper(
        {},
        { dateFormat: 'dd/MM/yyyy', combineFormats: false }
      );
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('format')).toBe('dd/MM/yyyy');
    });

    it('should pass placeholder to single input', () => {
      const wrapper = createWrapper({}, { placeholder: 'Pick a date' });
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('placeholder')).toBe('Pick a date');
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

    it('should pass custom id and name attributes to single input', () => {
      const wrapper = createWrapper(
        {},
        { startId: 'custom-id', startName: 'custom-name' }
      );
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('customId')).toBe('custom-id');
      expect(input.props('customName')).toBe('custom-name');
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
  });

  describe('Double Inputs (daterange type)', () => {
    it('should render two AppDateInput for daterange type', () => {
      const wrapper = createWrapper(
        {},
        { type: AppDateTimePickerType.DateRange }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs).toHaveLength(2);
    });

    it('should render separator for daterange type', () => {
      const wrapper = createWrapper(
        {},
        { type: AppDateTimePickerType.DateRange }
      );
      const separator = wrapper.find('p');
      expect(separator.exists()).toBe(true);
      expect(separator.text()).toBe('separator');
    });

    it('should pass array values to start and end inputs', () => {
      const startDate = new Date('2023-01-15');
      const endDate = new Date('2023-02-20');
      const wrapper = createWrapper(
        { modelValue: [startDate, endDate] },
        { type: AppDateTimePickerType.DateRange }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });

      expect(inputs[0].props('modelValue')).toEqual(startDate);
      expect(inputs[1].props('modelValue')).toEqual(endDate);
    });

    it('should emit update:model-value with array when start input changes', async () => {
      const endDate = new Date('2023-02-20');
      const wrapper = createWrapper(
        { modelValue: [null, endDate] },
        { type: AppDateTimePickerType.DateRange }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];
      const newStartDate = new Date('2023-01-15');

      await startInput.vm.$emit('update:model-value', newStartDate);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([
        [newStartDate, endDate],
      ]);
    });

    it('should emit update:model-value with array when end input changes', async () => {
      const startDate = new Date('2023-01-15');
      const wrapper = createWrapper(
        { modelValue: [startDate, null] },
        { type: AppDateTimePickerType.DateRange }
      );
      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];
      const newEndDate = new Date('2023-02-20');

      await endInput.vm.$emit('update:model-value', newEndDate);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([
        [startDate, newEndDate],
      ]);
    });

    it('should sort dates when both are provided', async () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { type: AppDateTimePickerType.DateRange }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];
      const laterDate = new Date('2023-02-20');
      const earlierDate = new Date('2023-01-15');

      await startInput.vm.$emit('update:model-value', laterDate);
      await wrapper.setProps({ modelValue: [laterDate, null] });

      const endInput = wrapper.findAllComponents({ name: 'AppDateInput' })[1];
      await endInput.vm.$emit('update:model-value', earlierDate);

      expect(wrapper.emitted('update:model-value')?.[1]).toEqual([
        [earlierDate, laterDate],
      ]);
    });

    it('should not sort dates when one is null', async () => {
      const wrapper = createWrapper(
        { modelValue: [null, null] },
        { type: AppDateTimePickerType.DateRange }
      );
      const startInput = wrapper.findAllComponents({ name: 'AppDateInput' })[0];
      const date = new Date('2023-02-20');

      await startInput.vm.$emit('update:model-value', date);

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([
        [date, null],
      ]);
    });

    it('should pass startPlaceholder to start input', () => {
      const wrapper = createWrapper(
        {},
        {
          type: AppDateTimePickerType.DateRange,
          startPlaceholder: 'Start',
        }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('placeholder')).toBe('Start');
    });

    it('should pass endPlaceholder to end input', () => {
      const wrapper = createWrapper(
        {},
        {
          type: AppDateTimePickerType.DateRange,
          endPlaceholder: 'End',
        }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[1].props('placeholder')).toBe('End');
    });

    it('should pass start and end ids to respective inputs', () => {
      const wrapper = createWrapper(
        {},
        {
          type: AppDateTimePickerType.DateRange,
          startId: 'start-id',
          endId: 'end-id',
        }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('customId')).toBe('start-id');
      expect(inputs[1].props('customId')).toBe('end-id');
    });

    it('should pass start and end names to respective inputs', () => {
      const wrapper = createWrapper(
        {},
        {
          type: AppDateTimePickerType.DateRange,
          startName: 'start-name',
          endName: 'end-name',
        }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('customName')).toBe('start-name');
      expect(inputs[1].props('customName')).toBe('end-name');
    });
  });

  describe('DateTime Type', () => {
    it('should combine date and time formats for datetime type', () => {
      const wrapper = createWrapper(
        {},
        {
          type: AppDateTimePickerType.DateTime,
          dateFormat: 'yyyy-MM-dd',
          timeFormat: 'HH:mm:ss',
          combineFormats: true,
        }
      );
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('format')).toBe('yyyy-MM-dd HH:mm:ss');
    });

    it('should not combine formats when combineFormats is false', () => {
      const wrapper = createWrapper(
        {},
        {
          type: AppDateTimePickerType.DateTime,
          dateFormat: 'yyyy-MM-dd',
          timeFormat: 'HH:mm:ss',
          combineFormats: false,
        }
      );
      const input = wrapper.findComponent({ name: 'AppDateInput' });
      expect(input.props('format')).toBe('yyyy-MM-dd');
    });

    it('should combine formats for datetimerange type', () => {
      const wrapper = createWrapper(
        {},
        {
          type: AppDateTimePickerType.DateTimeRange,
          dateFormat: 'MM/dd/yyyy',
          timeFormat: 'hh:mm a',
          combineFormats: true,
        }
      );
      const inputs = wrapper.findAllComponents({ name: 'AppDateInput' });
      expect(inputs[0].props('format')).toBe('MM/dd/yyyy hh:mm a');
      expect(inputs[1].props('format')).toBe('MM/dd/yyyy hh:mm a');
    });
  });

  describe('Clear functionality', () => {
    it('should show clear button when clearable is true and has value', () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-01-15') },
        { clearable: true }
      );
      const clearButton = wrapper.find('button');
      expect(clearButton.exists()).toBe(true);
    });

    it('should hide clear button when clearable is false', () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-01-15') },
        { clearable: false }
      );
      const clearButton = wrapper.find('button');
      expect(clearButton.exists()).toBe(false);
    });

    it('should hide clear button when no value is set', () => {
      const wrapper = createWrapper({ modelValue: null }, { clearable: true });
      const clearButton = wrapper.find('button');
      expect(clearButton.exists()).toBe(false);
    });

    it('should emit update:model-value with null when clear is clicked for single input', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-01-15') },
        { clearable: true }
      );
      const clearButton = wrapper.find('button');

      await clearButton.trigger('click');

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([null]);
    });

    it('should emit update:model-value with [null, null] when clear is clicked for range', async () => {
      const wrapper = createWrapper(
        { modelValue: [new Date('2023-01-15'), new Date('2023-02-20')] },
        { type: AppDateTimePickerType.DateRange, clearable: true }
      );
      const clearButton = wrapper.find('button');

      await clearButton.trigger('click');

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([
        [null, null],
      ]);
    });

    it('should emit clear event when clear is clicked', async () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-01-15') },
        { clearable: true }
      );
      const clearButton = wrapper.find('button');

      await clearButton.trigger('click');

      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('should show clear button when range has at least one value', () => {
      const wrapper = createWrapper(
        { modelValue: [new Date('2023-01-15'), null] },
        { type: AppDateTimePickerType.DateRange, clearable: true }
      );
      const clearButton = wrapper.find('button');
      expect(clearButton.exists()).toBe(true);
    });
  });

  describe('Disabled date validation', () => {
    it('should pass disabledDate function to inputs', () => {
      const disabledDate = vi.fn(() => true);
      const wrapper = createWrapper({}, { disabledDate });
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      const disabledDateProp = input.props('disabledDate');
      const testDate = new Date('2023-01-15');
      disabledDateProp(testDate);

      expect(disabledDate).toHaveBeenCalledWith(testDate);
    });

    it('should validate date using isDate when no disabledDate function provided', () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent({ name: 'AppDateInput' });

      const disabledDateProp = input.props('disabledDate');
      const validDate = new Date('2023-01-15');
      const invalidDate = 'invalid';

      expect(disabledDateProp(validDate)).toBe(false);
      expect(disabledDateProp(invalidDate)).toBe(true);
    });
  });

  describe('Icons', () => {
    it('should show calendar icon when clearable is false', () => {
      const wrapper = createWrapper({ modelValue: null }, { clearable: false });
      const icon = wrapper.findComponent(CalendarDaysIcon);

      expect(icon.exists()).toBe(true);
    });

    it('should not show calendar icon when clearable is true and has value', () => {
      const wrapper = createWrapper(
        { modelValue: new Date('2023-01-15') },
        { clearable: true }
      );
      const icon = wrapper.findComponent(CalendarDaysIcon);

      expect(icon.exists()).toBe(true);
    });
  });

  describe('Exposed methods', () => {
    it('should expose focus method', () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.focus).toBeDefined();

      wrapper.vm.focus();

      expect(focus).toHaveBeenCalled();
    });

    it('should expose blur method', () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.blur).toBeDefined();

      wrapper.vm.blur();

      expect(blur).toHaveBeenCalled();
    });

    it('should expose remove method', () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.remove).toBeDefined();
      wrapper.vm.remove();

      expect(remove).toHaveBeenCalled();
    });
  });

  describe('Separator slot', () => {
    it('should render separator slot content for range inputs', () => {
      const wrapper = createWrapper(
        {},
        { type: AppDateTimePickerType.DateRange }
      );
      const separator = wrapper.find('p');
      expect(separator.exists()).toBe(true);
      expect(separator.text()).toBe('separator');
    });

    it('should emit focus when separator is clicked', async () => {
      const wrapper = createWrapper(
        {},
        { type: AppDateTimePickerType.DateRange }
      );
      const separator = wrapper.find('p');

      await separator.trigger('click');

      expect(wrapper.emitted('focus')).toBeTruthy();
    });
  });
});
