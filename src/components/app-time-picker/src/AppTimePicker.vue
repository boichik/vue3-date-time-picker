<template>
  <div ref="timePicker" class="app-time-picker">
    <AppPopover
      ref="popover"
      v-model="popoverVisible"
      :placement="placement"
      :disabled="props.disabled"
      :tabindex="-1"
      :open-delay="props.openDelay"
      :close-delay="props.closeDelay"
      :append-to-body="props.appendToBody"
      @open="handleVisiblePopover()"
      @close="handleClosedPopover()"
    >
      <template #reference>
        <AppTimeInput
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
        </AppTimeInput>
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
        <AppTimeContent v-if="contentVisible" ref="content" v-model="model" />
      </template>
    </AppPopover>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type { Placement } from '@popperjs/core/lib/enums';
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  useSlots,
  watch,
} from 'vue';
import AppPopover from '@/ui/AppPopover.vue';
import AppTimeInput from './components/base/AppTimeInput.vue';
import AppTimeContent from './components/base/AppTimeContent.vue';
import { isSameModelValue } from '@/utils/isSameDateOrNullValue';
import { parseFormat } from '@/utils/parseFormat';
import { isBoolean, isString } from 'es-toolkit';
import { isValidTimeZone } from '@/utils/isValidTimeZone';
import { isDate } from '@/utils/isDate';
import { isValidModelValue } from '@/utils/isValidModelValue';
import { TimezoneConvertorImpl } from '@/services/timezone-convertor/TimezoneConvertor';
import { isValidAlign } from '@/utils/isValidAlign';
import {
  AppTimePickerInternalSettingsProvide,
  AppTimePickerComponentDataProvide,
} from './const/index';
import type {
  AppTimePickerProps,
  AppTimePickerModel,
  AppTimePickerInternalSettings,
  AppTimePickerComponentData,
  AppTimePickerExpose,
} from './interfaces';
import { isValidSelectableRange } from './utils';
import { useFocusInOutside } from '@/composables/useFocusInOutside';
import { useClickOutside } from '@/composables/useClickOutside';
import { getPlacementByAlign } from '@/utils/getPlacementByAlign';
import { isEmptyModels } from '@/utils/isEmptyModels';

const DEFAULT_TIME_FORMAT = 'HH:mm:ss';
const DEFAULT_READONLY = false;
const DEFAULT_DISABLED = false;
const DEFAULT_CLEARABLE = false;
const DEFAULT_ALIGN = 'left';
const DEFAULT_INVALID = false;
const DEFAULT_APPEND_TO_BODY = true;
const DEFAULT_STAY_OPENED = false;
const DEFAULT_INPUT_READONLY = false;
const DEFAULT_AUTO_APPLY = false;

const timezoneConvertor = new TimezoneConvertorImpl();

const emit = defineEmits(['update:model-value', 'change', 'focus', 'blur']);

const props = withDefaults(defineProps<AppTimePickerProps>(), {
  modelValue: null,
  readonly: DEFAULT_READONLY,
  disabled: DEFAULT_DISABLED,
  clearable: DEFAULT_CLEARABLE,
  align: DEFAULT_ALIGN,
  format: DEFAULT_TIME_FORMAT,
  invalid: DEFAULT_INVALID,
  appendToBody: DEFAULT_APPEND_TO_BODY,
  stayOpened: DEFAULT_STAY_OPENED,
  inputReadonly: DEFAULT_INPUT_READONLY,
  autoApply: DEFAULT_AUTO_APPLY,
});

const input = ref<HTMLInputElement | null>(null);
const timePicker = ref<HTMLElement | null>(null);
const popover = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const referece = ref<HTMLElement | null>(null);

const popoverVisible = ref(false);
const contentVisible = ref(false);

const model = ref<AppTimePickerModel>(null);

const disallowApplyValue = computed(() => {
  if (!!props.autoApply) {
    return isEmptyModels(model.value, props.modelValue);
  }

  return isSameModelValue(model.value, props.modelValue, props.timezone);
});

const isDisplayDefaultSlot = computed(() => !!useSlots()['default']);

const internalSettings = inject<AppTimePickerInternalSettings | null>(
  AppTimePickerInternalSettingsProvide,
  null
);

const appTimePickerComponentData = computed<AppTimePickerComponentData>(() => {
  const {
    readonly,
    disabled,
    clearable,
    align,
    placeholder,
    startPlaceholder,
    endPlaceholder,
    defaultTime,
    isRange,
    format,
    timezone,
    invalid,
    cancelText,
    applyText,
    inputReadonly,
    startId,
    endId,
    startName,
    endName,
  } = props;

  const { isDisabledDate } = internalSettings || {};

  const parsedTimezone = isValidTimeZone(timezone) ? timezone : '';
  const startDefaultTime = prepareDefaultTime(defaultTime, 0, parsedTimezone);
  const endDefaultTime = prepareDefaultTime(defaultTime, 1, parsedTimezone);

  return {
    format: parseFormat(format, DEFAULT_TIME_FORMAT),
    readonly: isBoolean(readonly) ? readonly : DEFAULT_READONLY,
    disabled: isBoolean(disabled) ? disabled : DEFAULT_DISABLED,
    clearable: isBoolean(clearable) ? clearable : DEFAULT_CLEARABLE,
    align: isValidAlign(align) ? align : DEFAULT_ALIGN,
    cancelText: isString(cancelText) ? cancelText : '',
    applyText: isString(applyText) ? applyText : '',
    invalid: isBoolean(invalid) ? invalid : DEFAULT_INVALID,
    inputReadonly: isBoolean(inputReadonly)
      ? inputReadonly
      : DEFAULT_INPUT_READONLY,
    startId: isString(startId) ? startId : '',
    endId: isString(endId) ? endId : '',
    startName: isString(startName) ? startName : '',
    endName: isString(endName) ? endName : '',
    startDefaultTime,
    endDefaultTime,
    placeholder,
    startPlaceholder,
    endPlaceholder,
    isRange: isBoolean(isRange) ? isRange : false,
    disabledApplyButton: disallowApplyValue.value,
    timezone: parsedTimezone,
    timezoneConvertor,
    selectableRange: getSelectableRange(),
    startSelectableRange: getSelectableRange(0),
    endSelectableRange: getSelectableRange(1),
    applyChange: handleApplyValue,
    cancelChange: handleCancel,
    isDisabledDate,
  };
});

provide<ComputedRef<AppTimePickerComponentData>>(
  AppTimePickerComponentDataProvide,
  appTimePickerComponentData
);

const placement = computed<Placement>(() => getPlacementByAlign(props.align));

watch(() => props.modelValue, externalInputValue);

watch(
  () => props.isRange,
  () => externalInputValue(props.modelValue)
);

watch(
  () => model.value,
  () => {
    if (!!props.autoApply) {
      handleApplyValue(false);
    }
  }
);

function handleVisiblePopover() {
  contentVisible.value = true;
}

const handleClosedPopover = () => {
  popoverVisible.value = false;
  contentVisible.value = false;
};

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

function prepareDefaultTime(
  value: unknown,
  index = 0,
  timezone?: string
): Date {
  if (Array.isArray(value) && isDate(value[index])) {
    return convertDateByTimezone(value[index], timezone);
  } else if (isDate(value)) {
    return convertDateByTimezone(value as Date, timezone);
  }

  return convertDateByTimezone(new Date(), timezone);
}

function prepareModelValue(value: unknown, forParse?: boolean) {
  const isRange = appTimePickerComponentData.value.isRange;

  if (
    !value ||
    (!!forParse && !isValidModelValue(value)) ||
    (Array.isArray(value) && !value.length)
  )
    return isRange ? [null, null] : null;

  if (Array.isArray(value)) {
    const map = value.map(el =>
      el && isDate(el)
        ? convertDateByTimezone(
            el,
            appTimePickerComponentData.value.timezone,
            !forParse
          )
        : null
    );

    return isRange ? map : map[0];
  }

  const oneValue =
    value && isDate(value)
      ? convertDateByTimezone(
          value as Date,
          appTimePickerComponentData.value.timezone,
          !forParse
        )
      : null;

  return isRange ? [oneValue, null] : oneValue;
}

function externalInputValue(value: unknown) {
  const newValue = prepareModelValue(value, true);

  if (!isSameModelValue(model.value, newValue)) {
    model.value = newValue;
  }
}

function getSelectableRange(index?: number) {
  const rangeFromSettings = props.selectableRange;

  if (typeof index === 'number') {
    return Array.isArray(rangeFromSettings) &&
      rangeFromSettings.length &&
      isValidSelectableRange(rangeFromSettings[index])
      ? rangeFromSettings[index]
      : undefined;
  } else {
    return typeof rangeFromSettings === 'string' &&
      isValidSelectableRange(rangeFromSettings)
      ? rangeFromSettings
      : undefined;
  }
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

function handleApplyValue(blur = true) {
  const value = prepareModelValue(model.value);

  emit('update:model-value', value);
  emit('change', value);

  if (blur) {
    input.value?.blur();
    handleBlur();
  }
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

useClickOutside([timePicker, input, content, referece], isOutside => {
  if (isOutside && !!popoverVisible.value && !props.stayOpened) {
    handleCancel();
  }
});

useFocusInOutside(
  [timePicker, input, content, referece],
  (isOutside, event) => {
    if (
      isOutside ||
      (event.target as HTMLElement).hasAttribute('data-popover-ignore')
    ) {
      if (popoverVisible.value && !props.stayOpened) {
        handleCancel();
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

defineExpose<AppTimePickerExpose>({ focus, blur, popoverVisible });
</script>
<style lang="scss">
.app-time-picker {
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
