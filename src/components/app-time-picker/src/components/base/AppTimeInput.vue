<template>
  <div :class="getClasses" class="app-time-picker-input">
    <AppDateInput
      ref="startInput"
      v-model="modelStart"
      :disabled="disabled"
      :readonly="readonly || inputReadonly"
      :placeholder="startInputPlaceholder"
      :format="format"
      :custom-id="attributesForNativeInputs.startId"
      :custom-name="attributesForNativeInputs.startName"
      :disabled-date="isDisabledStartInputValue"
      class="app-time-picker-input__inner"
      autocomplete="off"
      @focus="handleFocus(0)"
      @blur="handleBlur(0)"
    />
    <template v-if="isDoubleInputs">
      <div class="app-time-picker-input__separator" @click="handleFocus()">
        <slot name="separator"></slot>
      </div>
      <AppDateInput
        ref="endInput"
        v-model="modelEnd"
        :disabled="disabled"
        :readonly="readonly || inputReadonly"
        :placeholder="endInputPlaceholder"
        :format="format"
        :custom-id="attributesForNativeInputs.endId"
        :custom-name="attributesForNativeInputs.endName"
        :disabled-date="isDisabledEndInputValue"
        class="app-time-picker-input__inner"
        autocomplete="off"
        @focus="handleFocus(0)"
        @blur="handleBlur(1)"
      />
    </template>
    <div class="app-time-picker-input__after">
      <ClockIcon v-if="!clearable" class="app-time-picker-input__icon" />

      <button
        v-else
        data-popover-ignore
        class="app-time-picker-input__clear"
        @click="remove()"
      >
        <XMarkIcon class="app-time-picker-input__icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type {
  AppTimePickerComponentData,
  AppTimePickerModel,
} from '../../interfaces/index';
import { computed, inject, ref } from 'vue';
import { convertDateToTime, parseSelectableRange } from '../../utils';
import { isDate } from '@/utils/isDate';
import { isBefore, isAfter } from 'date-fns';
import AppDateInput from '@/ui/AppDateInput/Index.vue';
import XMarkIcon from '@heroicons/vue/16/solid/XMarkIcon';
import ClockIcon from '@heroicons/vue/24/outline/ClockIcon';
import { getDateWithZeroMilliseconds } from '@/utils/getNewDate';
import { AppTimePickerComponentDataProvide } from '../../const';

const emit = defineEmits([
  'input',
  'update:model-value',
  'clear',
  'focus',
  'blur',
]);

const props = defineProps<{
  modelValue: AppTimePickerModel;
  popoverVisible?: boolean;
}>();

const appTimePickerComponentData =
  inject<ComputedRef<AppTimePickerComponentData> | null>(
    AppTimePickerComponentDataProvide,
    null
  );

const startInput = ref<HTMLInputElement | null>();
const endInput = ref<HTMLInputElement | null>();

const isFocused = ref(false);
const isFocusedStartInput = ref(false);
const isFocusedEndInput = ref(false);

const modelStart = computed<Date | null>({
  get() {
    return Array.isArray(props.modelValue)
      ? props.modelValue[0]
      : props.modelValue;
  },
  set(val: Date | null) {
    const value = isDoubleInputs.value
      ? prepareArrayValue([val, modelEnd.value])
      : val;
    emit('update:model-value', value);
  },
});

const modelEnd = computed<Date | null>({
  get() {
    return Array.isArray(props.modelValue) ? props.modelValue[1] : null;
  },
  set(val: Date | null) {
    const value = prepareArrayValue([modelStart.value, val]);

    emit('update:model-value', value);
  },
});

const isDoubleInputs = computed(() => {
  return appTimePickerComponentData?.value.isRange;
});

const attributesForNativeInputs = computed(() => {
  const { startId, endId, startName, endName } =
    appTimePickerComponentData?.value || {};

  return {
    startId,
    endId,
    startName,
    endName,
  };
});

const disabled = computed(() => appTimePickerComponentData?.value.disabled);
const readonly = computed(() => appTimePickerComponentData?.value.readonly);

const inputReadonly = computed(
  () => appTimePickerComponentData?.value.inputReadonly
);

const clearable = computed(() => {
  return (
    appTimePickerComponentData?.value.clearable &&
    (!!modelStart.value || !!modelEnd.value)
  );
});
const invalid = computed(() => appTimePickerComponentData?.value.invalid);
const format = computed(() => appTimePickerComponentData?.value.format);

const startInputPlaceholder = computed(() => {
  const placeholder = isDoubleInputs.value
    ? appTimePickerComponentData?.value.startPlaceholder
    : appTimePickerComponentData?.value?.placeholder;

  return placeholder;
});

const endInputPlaceholder = computed(() => {
  const placeholder = appTimePickerComponentData?.value.endPlaceholder;

  return placeholder;
});

const startSelectableRange = computed(() =>
  getSelectableRange(isDoubleInputs.value ? 0 : undefined)
);
const endSelectableRange = computed(() => getSelectableRange(1));

const getClasses = computed(() => ({
  'app-time-picker-input--disabled': disabled.value,
  'app-time-picker-input--read-only': readonly.value,
  'app-time-picker-input--focus': !!isFocused.value || props.popoverVisible,
  'app-time-picker-input--range': !!isDoubleInputs.value,
  'app-time-picker-input--invalid': !!invalid.value,
}));

function prepareArrayValue(value: (null | Date)[]) {
  if (value.some(el => !el)) {
    return value;
  }

  return value.sort((a, b) => +(a as Date) - +(b as Date));
}

function isDisabledStartInputValue(value: unknown) {
  return getDisabledValueVoid(value, startSelectableRange.value);
}

function isDisabledEndInputValue(value: unknown) {
  return getDisabledValueVoid(value, endSelectableRange.value);
}

function getDisabledValueVoid(value: unknown, range?: string) {
  if (!isDate(value)) {
    return true;
  }

  if (
    !isDoubleInputs.value &&
    appTimePickerComponentData?.value.isDisabledDate
  ) {
    return appTimePickerComponentData.value.isDisabledDate(value as Date);
  }

  const { startTime, endTime } = parseSelectableRange(range, value as Date);
  if (!startTime || !endTime) {
    return false;
  }

  return (
    isBefore(getDateWithZeroMilliseconds(value as Date), startTime) ||
    isAfter(getDateWithZeroMilliseconds(value as Date), endTime)
  );
}

function getSelectableRange(index?: number) {
  const { selectableRange, startSelectableRange, endSelectableRange } =
    appTimePickerComponentData?.value || {};

  if (index === undefined) {
    return selectableRange;
  }

  if (index === 0 && startSelectableRange) {
    return startSelectableRange;
  }

  if (index === 1 && endSelectableRange) {
    return endSelectableRange;
  }

  const selectedModel = index === 0 ? modelEnd.value : modelStart.value;

  const template = (val: string) =>
    index === 0 ? `00:00:00 - ${val}` : `${val} - 23:59:59`;

  const time = convertDateToTime(selectedModel);

  const rangeFromModel = time ? template(time) : undefined;

  return rangeFromModel;
}

function handleFocus(index?: number) {
  switch (index) {
    case 0:
      isFocusedStartInput.value = true;
      break;
    case 1:
      isFocusedEndInput.value = true;
      break;
  }

  isFocused.value = true;
  emit('focus');
}

function handleBlur(index?: number) {
  switch (index) {
    case 0:
      isFocusedStartInput.value = false;
      break;
    case 1:
      isFocusedEndInput.value = false;
      break;
  }

  isFocused.value = false;
  emit('blur');
}

function remove() {
  const value = isDoubleInputs.value ? [null, null] : null;

  startInput.value?.remove();
  endInput.value?.remove();

  emit('update:model-value', value);
  emit('clear');
}

function focus() {
  startInput.value?.focus();
}

function blur() {
  startInput.value?.blur();
  endInput.value?.blur();
}

defineExpose({ focus, blur, remove });
</script>

<style lang="scss" scoped>
.app-time-picker-input {
  display: flex;
  align-items: center;
  width: calc(100% - var(--vpick--input-border-width) * 2);
  height: var(--vpick--input-height);
  border-radius: var(--vpick--input-border-radius);
  border: var(--vpick--input-border-width) solid
    var(--vpick--input-border-color);
  color: var(--vpick--input-color);
  background-color: var(--vpick--input-bg-color);
  transition: border-color var(--vpick--animation-delay);
  overflow: hidden;
  outline: unset;

  &--range &__inner {
    text-align: center !important;
  }

  &__after {
    padding-right: 14px;
  }

  &__icon {
    padding: 4px;
  }

  @media (hover: hover) {
    &:hover:not(.app-time-picker-input--focus):not(
        .app-datetime-picker-input--invalid
      ) {
      border-color: var(--vpick--input-hover-border-color);

      &:enabled {
        background: var(--vpick--input-hover-bg-color);
        color: var(--vpick--input-hover-color);
      }
    }
  }

  &--focus:not(.app-time-picker-input--disabled) {
    background: var(--vpick--input-focus-bg-color);
    color: var(--vpick--input-focus-color);
    border-color: var(--vpick--input-focus-border-color);

    .app-time-picker-input__inner {
      color: var(--vpick--input-focus-color);
    }
  }

  &--disabled {
    background: var(--vpick--input-disabled-bg-color);
    color: var(--vpick--input-disabled-color);
    border-color: var(--vpick--input-disabled-border-color);
    cursor: not-allowed;
  }

  &--read-only {
    background: var(--vpick--input-readonly-bg-color);
    color: var(--vpick--input-readonly-color);
    border-color: var(--vpick--input-readonly-border-color);
  }

  &--invalid:not(.app-time-picker-input--disabled):not(
      .app-time-picker-input--read-only
    ) {
    background-color: var(--vpick--input-invalid-bg-color);
    color: var(--vpick--input-invalid-color);
    border-color: var(--vpick--input-invalid-border-color);

    .app-time-picker-input__inner {
      background-color: var(--vpick--input-invalid-bg-color);
      color: var(--vpick--input-invalid-color);
    }
  }

  &__inner {
    width: 100%;
    height: 100%;
    padding: var(--vpick--input-padding);
    box-sizing: border-box;
    appearance: none;
    border: unset;

    &,
    &:hover,
    &:focus-visible {
      outline: none;
    }

    &:read-only {
      background: var(--vpick--input-readonly-bg-color);
      color: var(--vpick--input-readonly-color);
    }

    &:hover:enabled {
      background: var(--vpick--input-hover-bg-color);
      color: var(--vpick--input-hover-color);
    }

    &:focus-visible:enabled {
      background: var(--vpick--input-focus-bg-color);
      color: var(--vpick--input-focus-color);
    }

    &::placeholder {
      color: var(--vpick--input-placeholder-color);
    }

    &:disabled {
      background: var(--vpick--input-disabled-bg-color);
      color: var(--vpick--input-disabled-color);
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  &__after {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--vpick--input-icon-size);
    height: var(--vpick--input-icon-size);
  }

  &__icon {
    color: var(--vpick--input-icon-color);
    width: var(--vpick--input-icon-size);
    transition: color var(--vpick--animation-delay);
  }

  &__clear {
    outline: unset;
    background-color: transparent;
    border: unset;
    padding: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--vpick--input-icon-size);
    height: var(--vpick--input-icon-size);
  }

  &__clear &__icon {
    @media (hover: hover) {
      cursor: pointer;

      &:hover {
        color: var(--vpick--input-icon-hover-color);
      }
    }
  }
}
</style>
