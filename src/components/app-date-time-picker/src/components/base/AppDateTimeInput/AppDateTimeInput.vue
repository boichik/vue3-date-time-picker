<template>
  <div :class="getClasses" class="app-datetime-picker-input">
    <AppDateInput
      ref="startInput"
      v-model="modelStart"
      :disabled="disabled"
      :readonly="readonly || inputReadonly"
      :format="format"
      :placeholder="startInputPlaceholder"
      :custom-id="attributesForNativeInputs.startId"
      :custom-name="attributesForNativeInputs.startName"
      :disabled-date="isDisabledStartInputValue"
      class="app-datetime-picker-input__inner"
      autocomplete="off"
      @focus="handleFocus(0)"
      @blur="handleBlur(0)"
    />
    <template v-if="isDoubleInputs">
      <div class="app-datetime-picker-input__separator" @click="handleFocus()">
        <slot name="separator"></slot>
      </div>
      <AppDateInput
        ref="endInput"
        v-model="modelEnd"
        :disabled="disabled"
        :readonly="readonly || inputReadonly"
        :format="format"
        :placeholder="endInputPlaceholder"
        :custom-id="attributesForNativeInputs.endId"
        :custom-name="attributesForNativeInputs.endName"
        :disabled-date="isDisabledEndInputValue"
        class="app-datetime-picker-input__inner"
        autocomplete="off"
        @focus="handleFocus(0)"
        @blur="handleBlur(1)"
      />
    </template>
    <div class="app-datetime-picker-input__after">
      <CalendarDaysIcon
        v-if="!clearable"
        class="app-datetime-picker-input__icon"
      />

      <button
        v-if="clearable"
        data-popover-ignore
        class="app-datetime-picker-input__clear"
        @click="clear()"
      >
        <XMarkIcon class="app-datetime-picker-input__icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, useTemplateRef } from 'vue';
import AppDateInput from '@/ui/AppDateInput/Index.vue';
import type { ComputedRef } from 'vue';
import CalendarDaysIcon from '@heroicons/vue/16/solid/CalendarDaysIcon';
import XMarkIcon from '@heroicons/vue/16/solid/XMarkIcon';
import { isDate } from '@/utils/isDate';
import { AppDateTimePickerComponentDataProvide } from '../../../const';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerModel,
} from '../../../interfaces/index.interface';

const emit = defineEmits([
  'input',
  'update:model-value',
  'clear',
  'focus',
  'blur',
]);

const props = defineProps<{
  modelValue: AppDateTimePickerModel;
  popoverVisible?: boolean;
}>();

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const startInput =
  useTemplateRef<InstanceType<typeof AppDateInput>>('startInput');
const endInput = useTemplateRef<InstanceType<typeof AppDateInput>>('endInput');

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
  return ['daterange', 'datetimerange'].includes(
    appDateTimePickerComponentData?.value.type as never
  );
});

const isTimeTypes = computed(() => {
  return ['datetime', 'datetimerange'].includes(
    appDateTimePickerComponentData?.value.type as never
  );
});

const attributesForNativeInputs = computed(() => {
  const { startId, endId, startName, endName } =
    appDateTimePickerComponentData?.value || {};

  return {
    startId,
    endId,
    startName,
    endName,
  };
});

const disabled = computed(() => appDateTimePickerComponentData?.value.disabled);
const readonly = computed(() => appDateTimePickerComponentData?.value.readonly);

const inputReadonly = computed(
  () => appDateTimePickerComponentData?.value.inputReadonly
);

const invalid = computed(() => appDateTimePickerComponentData?.value.invalid);

const clearable = computed(() => {
  return (
    appDateTimePickerComponentData?.value.clearable &&
    (!!modelStart.value || !!modelEnd.value)
  );
});

const format = computed(() => {
  let template = appDateTimePickerComponentData?.value.dateFormat;

  if (
    isTimeTypes.value &&
    appDateTimePickerComponentData?.value.combineFormats
  ) {
    template += ` ${appDateTimePickerComponentData?.value.timeFormat}`;
  }

  return template;
});

const startInputPlaceholder = computed(() => {
  const placeholder = isDoubleInputs.value
    ? appDateTimePickerComponentData?.value.startPlaceholder
    : appDateTimePickerComponentData?.value?.placeholder;

  return placeholder;
});

const endInputPlaceholder = computed(() => {
  const placeholder = appDateTimePickerComponentData?.value.endPlaceholder;

  return placeholder;
});

function isDisabledStartInputValue(value: Date) {
  return getDisabledValueVoid(value);
}

function isDisabledEndInputValue(value: Date) {
  return getDisabledValueVoid(value);
}

function getDisabledValueVoid(value: unknown) {
  if (appDateTimePickerComponentData?.value.disabledDate) {
    return appDateTimePickerComponentData?.value.disabledDate(value as Date);
  }

  return !isDate(value);
}

const getClasses = computed(() => ({
  'app-datetime-picker-input--disabled': disabled.value,
  'app-datetime-picker-input--read-only': readonly.value,
  'app-datetime-picker-input--focus': !!isFocused.value || props.popoverVisible,
  'app-datetime-picker-input--range': !!isDoubleInputs.value,
  'app-datetime-picker-input--invalid': !!invalid.value,
}));

function prepareArrayValue(value: (null | Date)[]) {
  if (value.some(el => !el)) {
    return value;
  }

  return value.sort((a, b) => +(a as Date) - +(b as Date));
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

function clear() {
  const value = isDoubleInputs.value ? [null, null] : null;

  if (startInput.value?.remove) startInput.value?.remove();
  if (endInput.value?.remove) endInput.value?.remove();

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

defineExpose({ focus, blur, remove: clear });
</script>

<style lang="scss" scoped>
.app-datetime-picker-input {
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
    &:hover:not(.app-datetime-picker-input--focus):not(
        .app-datetime-picker-input--invalid
      ) {
      border-color: var(--vpick--input-hover-border-color);

      &:enabled {
        background-color: var(--vpick--input-hover-bg-color);
        color: var(--vpick--input-hover-color);
      }
    }
  }

  &--focus:not(.app-datetime-picker-input--disabled) {
    background-color: var(--vpick--input-focus-bg-color);
    color: var(--vpick--input-focus-color);
    border-color: var(--vpick--input-focus-border-color);

    .app-datetime-picker-input__inner {
      color: var(--vpick--input-focus-color);
    }
  }

  &--disabled {
    background-color: var(--vpick--input-disabled-bg-color);
    color: var(--vpick--input-disabled-color);
    border-color: var(--vpick--input-disabled-border-color);
    cursor: not-allowed;
  }

  &--read-only {
    background-color: var(--vpick--input-readonly-bg-color);
    color: var(--vpick--input-readonly-color);
    border-color: var(--vpick--input-readonly-border-color);
  }

  &--invalid:not(.app-datetime-picker-input--disabled):not(
      .app-datetime-picker-input--read-only
    ) {
    background-color: var(--vpick--input-invalid-bg-color);
    color: var(--vpick--input-invalid-color);
    border-color: var(--vpick--input-invalid-border-color);

    .app-datetime-picker-input__inner {
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
      background-color: var(--vpick--input-readonly-bg-color);
      color: var(--vpick--input-readonly-color);
    }

    &:hover:enabled {
      background-color: var(--vpick--input-hover-bg-color);
      color: var(--vpick--input-hover-color);
    }

    &:focus-visible:enabled {
      background-color: var(--vpick--input-focus-bg-color);
      color: var(--vpick--input-focus-color);
    }

    &::placeholder {
      color: var(--vpick--input-placeholder-color);
    }

    &:disabled {
      background-color: var(--vpick--input-disabled-bg-color);
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
