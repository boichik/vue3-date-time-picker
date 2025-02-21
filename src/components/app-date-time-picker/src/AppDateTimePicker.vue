<template>
  <div ref="datetimePicker" class="app-date-time-picker">
    <AppPopover
      ref="popover"
      v-model="popoverVisible"
      :placement="placement"
      :disabled="
        appDateTimePickerComponentData.disabled ||
        appDateTimePickerComponentData.readonly
      "
      :tabindex="-1"
      :append-to-body="props.appendToBody"
      @open="handleVisiblePopover()"
      @close="handleClosedPopover()"
    >
      <template #reference>
        <AppDateTimeInput
          v-if="!isDisplayDefaultSlot"
          ref="input"
          v-model="model"
          :popover-visible="popoverVisible"
          @focus="handleFocus"
          @clear="handleApplyValue"
        >
          <template #separator>
            <slot name="separator"></slot>
          </template>
        </AppDateTimeInput>
        <slot
          ref="referece"
          name="default"
          :value="model"
          :popover-visible="popoverVisible"
          :input="externalInputValue"
          :focus="handleFocus"
          :blur="handleClosedPopover"
        />
      </template>
      <template #content>
        <AppDateTimeContent
          v-if="contentVisible"
          ref="content"
          v-model="model"
        />
      </template>
    </AppPopover>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  ref,
  useSlots,
  watch,
} from 'vue';

import AppDateTimeInput from './components/base/AppDateTimeInput.vue';
import AppDateTimeContent from './components/base/AppDateTimeContent.vue';
import {
  isValidDefaultTime,
  isValidFirstDayOfWeek,
  isValidMode,
  isValidMonthFormat,
  isValidType,
  isValidWeekdayFormat,
} from './utils';
import { isBoolean, isString } from 'es-toolkit';
import { parseFormat } from '@/utils/parseFormat';
import { useLocalization } from '@/composables/useLocalization';
import { isValidTimeZone } from '@/utils/isValidTimeZone';
import { AppDateTimePickerType } from './enums/dateTimePickerType';
import { isDate } from '@/utils/isDate';
import { isSameModelValue } from '@/utils/isSameDateOrNullValue';
import { isValidModelValue } from '@/utils/isValidModelValue';
import { AppDateTimePickerComponentDataProvide } from './const';
import type { Placement } from '@popperjs/core';
import type {
  AppDateTimePickerProps,
  AppDateTimePickerModel,
  AppDateTimePickerComponentData,
  AppDateTimePickerExpose,
} from './interfaces';
import { TimezoneConvertorImpl } from '@/services/timezone-convertor/TimezoneConvertor';
import AppPopover from '@/ui/AppPopover.vue';
import { isValidAlign } from '@/utils/isValidAlign';
import { useClickOutside } from '@/composables/useClickOutside';
import { useFocusInOutside } from '@/composables/useFocusInOutside';
import { isValidLocale } from '@/utils/isValidLocale';
import { getPlacementByAlign } from '@/utils/getPlacementByAlign';

const DEFAULT_DATE_FORMAT = 'yyyy/MM/dd';
const DEFAULT_TIME_FORMAT = 'HH:mm:ss';
const DEFAULT_READONLY = false;
const DEFAULT_DISABLED = false;
const DEFAULT_CLEARABLE = false;
const DEFAULT_INVALID = false;
const DEFAULT_TYPE = 'date';
const DEFAULT_MODE = 'day';
const DEFAULT_ALIGN = 'left';
const DEFAULT_FIRST_DAY_OF_WEEK = 1;
const DEFAULT_COMBINE_FORMATS = true;
const DEFAULT_LOCALE = 'en';
const DEFAULT_WEEDDAY_FORMAT = 'short';
const DEFAULT_MONTH_CELL_FORMAT = 'short';
const DEFAULT_MONTH_BUTTON_FORMAT = 'long';
const DEFAULT_APPEND_TO_BODY = true;
const DEFAULT_STAY_OPENED = false;
const DEFAULT_INPUT_READONLY = false;

const localization = useLocalization();
const timezoneConvertor = new TimezoneConvertorImpl();

const emit = defineEmits(['update:model-value', 'change', 'focus', 'blur']);

const props = withDefaults(defineProps<AppDateTimePickerProps>(), {
  modelValue: null,
  dateFormat: DEFAULT_DATE_FORMAT,
  timeFormat: DEFAULT_TIME_FORMAT,
  readonly: DEFAULT_READONLY,
  disabled: DEFAULT_DISABLED,
  clearable: DEFAULT_CLEARABLE,
  type: DEFAULT_TYPE,
  mode: DEFAULT_MODE,
  align: DEFAULT_ALIGN,
  firstDayOfWeek: DEFAULT_FIRST_DAY_OF_WEEK,
  combineFormats: DEFAULT_COMBINE_FORMATS,
  locale: DEFAULT_LOCALE,
  weekdayFormat: DEFAULT_WEEDDAY_FORMAT,
  monthCellFormat: DEFAULT_MONTH_CELL_FORMAT,
  monthButtonFormat: DEFAULT_MONTH_BUTTON_FORMAT,
  invalid: DEFAULT_INVALID,
  appendToBody: DEFAULT_APPEND_TO_BODY,
  stayOpened: DEFAULT_STAY_OPENED,
  inputReadonly: DEFAULT_INPUT_READONLY,
});

const input = ref<HTMLInputElement | null>(null);
const datetimePicker = ref<HTMLElement | null>(null);
const popover = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const referece = ref<HTMLElement | null>(null);

const popoverVisible = ref(false);
const contentVisible = ref(false);

const model = ref<AppDateTimePickerModel>(null);

const isDisplayDefaultSlot = computed(() => !!useSlots()['default']);

const currentLocale = computed(() => {
  if (localization) return localization.locale.value;

  return isValidLocale(props.locale) ? props.locale : DEFAULT_LOCALE;
});

const disallowApplyValue = computed(() =>
  isSameModelValue(model.value, props.modelValue, props.timezone)
);

const appDateTimePickerComponentData = computed<AppDateTimePickerComponentData>(
  () => {
    const {
      readonly,
      disabled,
      clearable,
      firstDayOfWeek,
      align,
      type,
      placeholder,
      startPlaceholder,
      endPlaceholder,
      shortcuts,
      timeOptions,
      defaultTime,
      dateFormat,
      timeFormat,
      combineFormats,
      weekdayFormat,
      monthCellFormat,
      monthButtonFormat,
      invalid,
      cancelText,
      applyText,
      timezone,
      inputReadonly,
      mode,
      disabledDate,
    } = props;

    const parsedTimezone = isValidTimeZone(timezone) ? timezone : '';

    return {
      readonly: isBoolean(readonly) ? readonly : DEFAULT_READONLY,
      disabled: isBoolean(disabled) ? disabled : DEFAULT_DISABLED,
      clearable: isBoolean(clearable) ? clearable : DEFAULT_CLEARABLE,
      firstDayOfWeek: isValidFirstDayOfWeek(firstDayOfWeek)
        ? firstDayOfWeek
        : DEFAULT_FIRST_DAY_OF_WEEK,
      align: isValidAlign(align) ? align : DEFAULT_ALIGN,
      type: isValidType(type) ? type : DEFAULT_TYPE,
      mode: isValidMode(mode) ? mode : DEFAULT_MODE,
      defaultTime: isValidDefaultTime(defaultTime) ? defaultTime : '',
      combineFormats: isBoolean(combineFormats)
        ? combineFormats
        : DEFAULT_COMBINE_FORMATS,
      weekdayFormat: isValidWeekdayFormat(weekdayFormat)
        ? weekdayFormat
        : DEFAULT_WEEDDAY_FORMAT,
      monthCellFormat: isValidMonthFormat(monthCellFormat)
        ? monthCellFormat
        : DEFAULT_MONTH_CELL_FORMAT,
      monthButtonFormat: isValidMonthFormat(monthButtonFormat)
        ? monthButtonFormat
        : DEFAULT_MONTH_BUTTON_FORMAT,
      invalid: isBoolean(invalid) ? invalid : DEFAULT_INVALID,
      cancelText: isString(cancelText) ? cancelText : '',
      applyText: isString(applyText) ? applyText : '',
      placeholder: isString(placeholder) ? placeholder : '',
      startPlaceholder: isString(startPlaceholder) ? startPlaceholder : '',
      endPlaceholder: isString(endPlaceholder) ? endPlaceholder : '',
      inputReadonly: isBoolean(inputReadonly)
        ? inputReadonly
        : DEFAULT_INPUT_READONLY,
      timezone: parsedTimezone,
      locale: currentLocale.value,
      // TODO: add JSON validator
      shortcuts,
      disabledDate,
      timezoneConvertor,
      disabledApplyButton: disallowApplyValue.value,
      today: convertDateByTimezone(new Date(), parsedTimezone),
      dateFormat: parseFormat(dateFormat, DEFAULT_DATE_FORMAT),
      timeFormat: parseFormat(timeFormat, DEFAULT_TIME_FORMAT),
      timeOptions: typeof timeOptions === 'object' ? timeOptions : {},
      applyChange: handleApplyValue,
      cancelChange: handleCancel,
    };
  }
);

provide<ComputedRef<AppDateTimePickerComponentData>>(
  AppDateTimePickerComponentDataProvide,
  appDateTimePickerComponentData
);

const isRangeComponentType = computed(
  () =>
    !![
      AppDateTimePickerType.DateRange,
      AppDateTimePickerType.DateTimeRange,
    ].includes(appDateTimePickerComponentData.value.type as never)
);

const placement = computed<Placement>(() => getPlacementByAlign(props.align));

watch(() => props.modelValue, externalInputValue);

watch(
  () => props.type,
  () => externalInputValue(props.modelValue)
);

function handleVisiblePopover() {
  contentVisible.value = true;
}

const handleClosedPopover = () => {
  popoverVisible.value = false;
  contentVisible.value = false;
};

function prepareModelValue(value: unknown, forParse?: boolean) {
  if (
    !value ||
    (!!forParse && !isValidModelValue(value)) ||
    (Array.isArray(value) && !value.length)
  )
    return isRangeComponentType.value ? [null, null] : null;

  if (Array.isArray(value)) {
    const map = value.map(el =>
      el && isDate(el)
        ? convertDateByTimezone(
            el,
            appDateTimePickerComponentData.value.timezone,
            !forParse
          )
        : null
    );

    return isRangeComponentType.value ? map : map[0];
  }
  const oneValue =
    value && isDate(value)
      ? convertDateByTimezone(
          value as Date,
          appDateTimePickerComponentData.value.timezone,
          !forParse
        )
      : null;

  return isRangeComponentType.value ? [oneValue, null] : oneValue;
}

function externalInputValue(value: unknown) {
  const newValue = prepareModelValue(value, true);

  if (!isSameModelValue(model.value, newValue)) {
    model.value = newValue;
  }
}

function convertDateByTimezone(
  value: Date,
  timezone?: string,
  toLocal?: boolean
) {
  if (!toLocal && timezone) {
    return timezoneConvertor.convertToTimeZone(value, timezone);
  }

  return timezoneConvertor.convertToLocalTime(value, timezone);
}

function handleFocus() {
  popoverVisible.value = true;
  emit('focus');
}

function handleBlur() {
  if (props.stayOpened) return;

  popoverVisible.value = false;
  emit('blur');
}

function clearValue() {
  model.value = null;
  input.value?.remove();
}

function handleCancel() {
  if (props.modelValue) {
    model.value = prepareModelValue(props.modelValue, true);
  } else {
    clearValue();
  }

  input.value?.blur();
  handleBlur();
}

function handleApplyValue() {
  const value = prepareModelValue(model.value);
  emit('update:model-value', value);
  emit('change', value);
  input.value?.blur();
  handleBlur();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !disallowApplyValue.value) {
    handleApplyValue();
  }

  if (event.key === 'Escape') {
    handleCancel();
  }
}

function focus() {
  input.value?.focus();
}

function blur() {
  input.value?.blur();
  handleCancel();
}

useClickOutside([datetimePicker, input, content, referece], isOutside => {
  if (isOutside && !!popoverVisible.value && !props.stayOpened) {
    handleCancel();
  }
});

useFocusInOutside(
  [datetimePicker, input, content, referece],
  (isOutside, event) => {
    if (
      isOutside ||
      (event.target as HTMLElement).hasAttribute('data-popover-ignore')
    ) {
      if (popoverVisible.value && !props.stayOpened) {
        handleBlur();
      }

      return;
    }
    if (!popoverVisible.value) {
      focus();
    }
  }
);

model.value = prepareModelValue(props.modelValue, true);

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('blur', () => {
    if (popoverVisible.value && !props.stayOpened) handleCancel();
  });
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('blur', handleCancel);
});

defineExpose<AppDateTimePickerExpose>({ focus, blur, popoverVisible });
</script>

<style lang="scss">
.app-date-time-picker {
  position: relative;
  width: 100%;

  &:focus-visible {
    outline: unset;
  }

  *,
  ::before,
  ::after {
    box-sizing: content-box;
  }
}
</style>
