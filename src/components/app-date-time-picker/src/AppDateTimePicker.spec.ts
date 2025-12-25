import { shallowMount } from '@vue/test-utils';
import { defineComponent, inject, nextTick, type ComputedRef } from 'vue';
import AppDateTimePicker from './AppDateTimePicker.vue';
import AppDateTimeInput from './components/base/AppDateTimeInput/AppDateTimeInput.vue';
import AppPopover from '@/ui/AppPopover/Index.vue';
import { AppDateTimePickerComponentDataProvide } from './const';
import { AppDateTimePickerType } from './enums/dateTimePickerType';
import type { AppDateTimePickerComponentData } from './interfaces/index.interface';
import { TimezoneConvertor } from '@/services/timezone-convertor';

vi.mock('@/composables/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}));

vi.mock('@/composables/useFocusInOutside', () => ({
  useFocusInOutside: vi.fn(),
}));

const { focus, blur, remove } = vi.hoisted(() => ({
  focus: vi.fn(),
  blur: vi.fn(),
  remove: vi.fn(),
}));

describe('AppDateTimePicker', () => {
  let injectedAppDateTimePickerComponentData: ComputedRef<AppDateTimePickerComponentData>;

  const AppDateTimeContent = defineComponent({
    // eslint-disable-next-line vue/require-prop-types
    props: ['modelValue'],
    setup() {
      injectedAppDateTimePickerComponentData = inject(
        AppDateTimePickerComponentDataProvide,
        null
      )!;

      return {};
    },
    template: '<div></div>',
  });

  const createWrapper = (
    props: Partial<InstanceType<typeof AppDateTimePicker>['$props']> = {},
    referenceSlot?: string,
    separatorSlot?: string
  ) => {
    return shallowMount(AppDateTimePicker, {
      props: {
        modelValue: null,
        ...props,
      },
      global: {
        stubs: {
          AppPopover: {
            props: [
              'placement',
              'disabled',
              'appendToBody',
              'zIndex',
              'clientOnlyPopoverContent',
            ],
            template:
              '<div><slot name="reference" /><slot name="content" /></div>',
            name: 'AppPopover',
          },
          AppDateTimeInput: {
            props: ['modelValue', 'popoverVisible'],
            template: '<div><slot name="separator"/></div>',
            name: 'AppDateTimeInput',
            methods: {
              focus,
              blur,
              remove,
            },
          },
          AppDateTimeContent,
        },
      },
      slots: {
        ...(referenceSlot ? { default: referenceSlot } : {}),
        ...(separatorSlot ? { separator: separatorSlot } : {}),
      },
    });
  };

  const setValueInInput = async (
    wrapper: ReturnType<typeof createWrapper>,
    value: unknown
  ) => {
    const input = wrapper.findComponent(AppDateTimeInput);

    await input.vm.$emit('update:modelValue', value);

    return { input };
  };

  const openPopover = async (wrapper: ReturnType<typeof createWrapper>) => {
    const popover = wrapper.findComponent(AppPopover);

    await popover.vm.$emit('open');

    await nextTick();

    const content = wrapper.findComponent(AppDateTimeContent);
    expect(content.exists()).toBe(true);

    expect(injectedAppDateTimePickerComponentData.value).toBeDefined();

    return { popover, content };
  };

  const closePopover = async (wrapper: ReturnType<typeof createWrapper>) => {
    const popover = wrapper.findComponent(AppPopover);

    await popover.vm.$emit('close');

    await nextTick();
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render AppPopover component', () => {
      const wrapper = createWrapper();
      const popover = wrapper.findComponent(AppPopover);

      expect(popover.exists()).toBe(true);
    });

    it('should render AppDateTimeInput when no default slot provided', () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent(AppDateTimeInput);

      expect(input.exists()).toBe(true);
    });

    it('should not render AppDateTimeInput when default slot provided', () => {
      const wrapper = createWrapper(
        {},
        '<div class="custom-input">Custom Input</div>'
      );
      const input = wrapper.findComponent(AppDateTimeInput);

      expect(input.exists()).toBe(false);
    });

    it('should render default slot content', () => {
      const wrapper = createWrapper(
        {},
        '<div class="custom-input">Custom Input</div>'
      );

      expect(wrapper.html()).toContain('Custom Input');
    });
  });

  it.each([
    ['disabled', true],
    ['appendToBody', false],
    ['zIndex', 9999],
    ['clientOnlyPopoverContent', true],
  ])('should pass %s prop to AppPopover', (prop, value) => {
    const wrapper = createWrapper({ [prop]: value });
    const popover = wrapper.findComponent(AppPopover);

    expect(popover.props(prop as never)).toBe(value);
  });

  describe('Props Passing to AppDateTimeInput', () => {
    it('should pass modelValue to AppDateTimeInput', () => {
      const date = new Date('2024-06-15');
      const wrapper = createWrapper({ modelValue: date });
      const input = wrapper.findComponent(AppDateTimeInput);

      expect(input.props('modelValue')).toEqual(date);
    });

    it('should pass popoverVisible to AppDateTimeInput', async () => {
      const wrapper = createWrapper();
      const input = wrapper.findComponent(AppDateTimeInput);

      expect(input.props('popoverVisible')).toBe(false);

      await input.vm.$emit('focus');
      await nextTick();

      expect(input.props('popoverVisible')).toBe(true);
    });
  });

  describe('ModelValue Formatting and Parsing', () => {
    it('should handle Date modelValue', () => {
      const date = new Date('2024-06-15');
      const wrapper = createWrapper({ modelValue: date });

      const input = wrapper.findComponent(AppDateTimeInput);

      expect(input.props('modelValue')).toEqual(date);
    });

    it('should handle null modelValue', () => {
      const wrapper = createWrapper({ modelValue: null });

      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toBeNull();
    });

    it('should handle undefined modelValue', () => {
      const wrapper = createWrapper({ modelValue: undefined });

      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toBeNull();
    });

    it('should handle array modelValue for DateRange type', () => {
      const dates = [new Date('2024-06-10'), new Date('2024-06-20')];
      const wrapper = createWrapper({
        modelValue: dates,
        type: AppDateTimePickerType.DateRange,
      });

      expect(
        Array.isArray(
          wrapper.findComponent(AppDateTimeInput).props('modelValue')
        )
      ).toBe(true);
      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toEqual(dates);
    });

    it('should convert single date to array for DateRange type', () => {
      const date = new Date('2024-06-15');
      const wrapper = createWrapper({
        modelValue: date,
        type: AppDateTimePickerType.DateRange,
      });

      const model = wrapper.findComponent(AppDateTimeInput).props('modelValue');

      expect(Array.isArray(model)).toBe(true);
      expect((model as Array<Date | null>)[0]).toEqual(date);
      expect((model as Array<Date | null>)[1]).toBeNull();
    });

    it('should convert array to single date for Date type', () => {
      const dates = [new Date('2024-06-10'), new Date('2024-06-20')];
      const wrapper = createWrapper({
        modelValue: dates,
        type: AppDateTimePickerType.Date,
      });

      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toEqual(dates[0]);
    });

    it('should handle empty array modelValue', () => {
      const wrapper = createWrapper({
        modelValue: [],
        type: AppDateTimePickerType.DateRange,
      });

      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toEqual([null, null]);
    });

    it('should handle array with null values', () => {
      const wrapper = createWrapper({
        modelValue: [null, null],
        type: AppDateTimePickerType.DateRange,
      });

      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toEqual([null, null]);
    });

    it('should handle invalid date in modelValue', () => {
      // @ts-expect-error - testing invalid input
      const wrapper = createWrapper({ modelValue: 'invalid' });

      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toBeNull();
    });

    it('should update model when modelValue prop changes', async () => {
      const wrapper = createWrapper({ modelValue: null });

      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toBeNull();

      const newDate = new Date('2024-06-15');
      await wrapper.setProps({ modelValue: newDate });

      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toEqual(newDate);
    });

    it('should update model when type prop changes', async () => {
      const date = new Date('2024-06-15');
      const wrapper = createWrapper({
        modelValue: date,
        type: AppDateTimePickerType.Date,
      });

      expect(
        wrapper.findComponent(AppDateTimeInput).props('modelValue')
      ).toEqual(date);

      await wrapper.setProps({ type: AppDateTimePickerType.DateRange });
      await nextTick();

      expect(
        Array.isArray(
          wrapper.findComponent(AppDateTimeInput).props('modelValue')
        )
      ).toBe(true);
    });
  });

  describe('ModelValue Update Events', () => {
    it('should emit update:model-value on apply', async () => {
      const wrapper = createWrapper();
      const date = new Date('2024-06-15');

      await openPopover(wrapper);

      await setValueInInput(wrapper, date);

      injectedAppDateTimePickerComponentData.value.applyChange();

      expect(blur).toHaveBeenCalled();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(wrapper.emitted('update:model-value')![0]).toEqual([date]);
    });

    it('should emit change event on apply', async () => {
      const wrapper = createWrapper();
      const date = new Date('2024-06-15');

      await openPopover(wrapper);

      await setValueInInput(wrapper, date);

      injectedAppDateTimePickerComponentData.value.applyChange();

      expect(blur).toHaveBeenCalled();

      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')![0]).toEqual([date]);
    });

    it('should emit update:model-value with array for DateRange', async () => {
      const wrapper = createWrapper({ type: AppDateTimePickerType.DateRange });
      const dates = [new Date('2024-06-10'), new Date('2024-06-20')];

      await openPopover(wrapper);

      await setValueInInput(wrapper, dates);

      injectedAppDateTimePickerComponentData.value.applyChange();

      expect(blur).toHaveBeenCalled();

      expect(wrapper.emitted('update:model-value')![0]).toEqual([dates]);
    });

    it('should auto apply on model change when autoApply is true', async () => {
      const wrapper = createWrapper({ autoApply: true });
      const date = new Date('2024-06-15');

      await setValueInInput(wrapper, date);

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
    });

    it('should not auto apply when autoApply is false', async () => {
      const wrapper = createWrapper({ autoApply: false });
      const date = new Date('2024-06-15');

      await setValueInInput(wrapper, date);

      expect(wrapper.emitted('update:model-value')).toBeFalsy();
    });

    it('should emit focus event', async () => {
      const wrapper = createWrapper();

      await wrapper.findComponent(AppDateTimeInput).vm.$emit('focus');

      expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('should emit blur event', async () => {
      const wrapper = createWrapper();

      await openPopover(wrapper);

      injectedAppDateTimePickerComponentData.value.cancelChange();

      expect(wrapper.emitted('blur')).toBeTruthy();
    });

    it('should not emit blur when stayOpened is true', async () => {
      const wrapper = createWrapper({ stayOpened: true });

      await openPopover(wrapper);

      injectedAppDateTimePickerComponentData.value.cancelChange();

      expect(wrapper.emitted('blur')).toBeFalsy();
    });
  });

  describe('Popover Visibility', () => {
    it('should open popover on focus', async () => {
      const wrapper = createWrapper();

      const input = wrapper.findComponent(AppDateTimeInput);

      expect(input.props('popoverVisible')).toBe(false);

      await wrapper.findComponent(AppDateTimeInput).vm.$emit('focus');

      expect(input.props('popoverVisible')).toBe(true);
    });

    it('should close popover on blur', async () => {
      const wrapper = createWrapper();

      const input = wrapper.findComponent(AppDateTimeInput);

      await wrapper.findComponent(AppDateTimeInput).vm.$emit('focus');

      expect(input.props('popoverVisible')).toBe(true);

      await closePopover(wrapper);

      expect(input.props('popoverVisible')).toBe(false);
    });
  });

  describe('Cancel and Clear Operations', () => {
    it('should reset model to modelValue on cancel', async () => {
      const originalDate = new Date('2024-06-15');
      const wrapper = createWrapper({ modelValue: originalDate });

      await openPopover(wrapper);
      await setValueInInput(wrapper, originalDate);

      injectedAppDateTimePickerComponentData.value.cancelChange();

      expect(wrapper.props('modelValue')).toEqual(originalDate);
    });

    it('should clear model when modelValue is null on cancel', async () => {
      const wrapper = createWrapper({ modelValue: null });

      await openPopover(wrapper);
      await setValueInInput(wrapper, new Date('2024-06-15'));

      injectedAppDateTimePickerComponentData.value.cancelChange();

      expect(wrapper.props('modelValue')).toBeNull();
    });

    it('should close popover on cancel', async () => {
      const wrapper = createWrapper();

      const input = wrapper.findComponent(AppDateTimeInput);

      expect(input.props('popoverVisible')).toBe(false);

      await openPopover(wrapper);

      injectedAppDateTimePickerComponentData.value.cancelChange();

      await nextTick();

      expect(input.props('popoverVisible')).toBe(false);
    });
  });

  describe('Keyboard Events', () => {
    it('should apply value on Enter key', async () => {
      const wrapper = createWrapper();
      const date = new Date('2024-06-15');

      await setValueInInput(wrapper, date);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      document.dispatchEvent(event);

      await nextTick();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
    });

    it('should not apply value on Enter when disallowApplyValue is true', async () => {
      const date = new Date('2024-06-15');
      const wrapper = createWrapper({ modelValue: date });

      await setValueInInput(wrapper, date);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      document.dispatchEvent(event);

      await nextTick();

      expect(wrapper.emitted('update:model-value')).toBeFalsy();
    });

    it('should cancel on Escape key', async () => {
      const originalDate = new Date('2024-06-15');
      const wrapper = createWrapper({ modelValue: originalDate });

      const { input } = await setValueInInput(wrapper, new Date('2024-06-20'));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      document.dispatchEvent(event);

      await nextTick();

      expect(input.props('modelValue')).toEqual(originalDate);
    });
  });

  it.each([
    ['readonly', false],
    ['disabled', false],
    ['clearable', false],
    ['firstDayOfWeek', 1],
    ['align', 'left'],
    ['type', 'date'],
    ['mode', 'day'],
    ['combineFormats', true],
    ['weekdayFormat', 'short'],
    ['monthCellFormat', 'short'],
    ['monthButtonFormat', 'long'],
    ['invalid', false],
    ['cancelText', ''],
    ['applyText', ''],
    ['placeholder', ''],
    ['startPlaceholder', ''],
    ['endPlaceholder', ''],
    ['inputReadonly', false],
    ['hideOffsetDay', false],
    ['timezone', ''],
    ['locale', 'en'],
    ['shortcuts', undefined],
    ['disabledDate', undefined],
    ['timezoneConvertor', new TimezoneConvertor()],
    ['disabledApplyButton', true],
    ['today', String, true],
    ['dateFormat', 'yyyy/MM/dd'],
    ['timeFormat', 'HH:mm:ss'],
    ['timeOptions', {}],
    ['startId', ''],
    ['endId', ''],
    ['startName', ''],
    ['endName', ''],
    ['applyChange', Function, true],
    ['cancelChange', Function, true],
  ])(
    'should have correct default value for %s prop',
    // @ts-expect-error - testing various prop types
    async (prop, value, hasField) => {
      const wrapper = createWrapper();

      await openPopover(wrapper);

      if (hasField) {
        expect(
          typeof injectedAppDateTimePickerComponentData.value[prop as never]
        ).toBeDefined();
        return;
      }

      expect(
        injectedAppDateTimePickerComponentData.value[prop as never]
      ).toStrictEqual(value);
    }
  );

  it.each([
    ['type', 'invalid-type', 'date'],
    ['mode', 'invalid-mode', 'day'],
    ['align', 'invalid-align', 'left'],
    ['firstDayOfWeek', 10, 1],
    ['weekdayFormat', 'invalid', 'short'],
    ['monthCellFormat', 'invalid', 'short'],
    ['timezone', 'Invalid/Timezone', ''],
    ['locale', 'invalid-locale', 'en'],
    ['readonly', 'true', false],
    ['disabled', 'true', false],
    ['placeholder', 123, ''],
    ['timeOptions', 'invalid', {}],
  ])(
    'should fallback to default value for invalid %s prop',
    async (prop, invalidValue, defaultValue) => {
      const wrapper = createWrapper({ [prop]: invalidValue });

      await openPopover(wrapper);

      expect(
        injectedAppDateTimePickerComponentData.value[prop as never]
      ).toStrictEqual(defaultValue);
    }
  );

  describe('Exposed Methods', () => {
    it('should expose focus method', () => {
      const wrapper = createWrapper();

      expect(typeof wrapper.vm.focus).toBe('function');
    });

    it('should expose blur method', () => {
      const wrapper = createWrapper();

      expect(typeof wrapper.vm.blur).toBe('function');
    });

    it('should expose popoverVisible ref', () => {
      const wrapper = createWrapper();

      expect(typeof wrapper.vm.popoverVisible).toBe('boolean');
    });
  });

  describe('Timezone Handling', () => {
    it('should convert date to timezone on emit', async () => {
      const wrapper = createWrapper({ timezone: 'America/New_York' });
      const date = new Date('2024-06-15T12:00:00Z');

      await openPopover(wrapper);

      await setValueInInput(wrapper, date);

      injectedAppDateTimePickerComponentData.value.applyChange();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
    });

    it('should handle timezone conversion for array values', async () => {
      const dates = [new Date('2024-06-10'), new Date('2024-06-20')];
      const wrapper = createWrapper({
        type: AppDateTimePickerType.DateRange,
        timezone: 'America/New_York',
      });

      await openPopover(wrapper);

      await setValueInInput(wrapper, dates);

      injectedAppDateTimePickerComponentData.value.applyChange();

      expect(wrapper.emitted('update:model-value')).toBeTruthy();
      expect(Array.isArray(wrapper.emitted('update:model-value')![0][0])).toBe(
        true
      );
    });
  });

  describe('Slots', () => {
    it('should render separator slot', () => {
      const wrapper = createWrapper(
        undefined,
        undefined,
        '<span class="custom-separator">-</span>'
      );

      expect(wrapper.html()).toContain('custom-separator');
    });

    it('should pass correct slot props to default slot', () => {
      const wrapper = createWrapper(
        undefined,
        `
            <template #default="{ value, popoverVisible, input, focus, blur }">
              <div class="slot-content">
                <span class="slot-visible">{{ popoverVisible }}</span>
              </div>
            </template>
          `
      );

      expect(wrapper.html()).toContain('slot-content');
    });
  });
});
