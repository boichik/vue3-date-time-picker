<template>
  <input
    ref="input"
    v-model="model"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :placeholder="props.placeholder"
    type="text"
    class="app-date-input"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import { format } from 'date-fns/format';
import { isDate } from '../utils/isDate';
import type { Ref } from 'vue';
import { ref, watch, defineProps, onMounted, onBeforeUnmount } from 'vue';
import { IMask } from 'vue-imask';
import { getDaysInMonth, isValid, parse } from 'date-fns';
import { getNewDate } from '../utils/getNewDate';
import { inputBlocks } from '../const/inputBlocks.const';

type InputMask = InstanceType<typeof IMask.InputMask>;

const emit = defineEmits(['update:model-value', 'focus', 'blur']);

const props = withDefaults(
  defineProps<{
    modelValue?: null | Date;
    format?: string;
    readonly?: boolean;
    disabled?: boolean;
    placeholder?: string;
    disabledDate?: (date: Date) => boolean;
  }>(),
  {
    modelValue: null,
    format: 'yyyy/MM/dd',
    readonly: false,
    disabled: false,
    disabledDate: undefined,
  }
);

const input = ref<HTMLInputElement | null>(null);

const model = ref<string>('');
const imaskInstance: Ref<InputMask | null> = ref(null);

watch(
  () => props.modelValue,
  value => {
    updateInternalModel(value);
  }
);

function updateInternalModel(value: unknown) {
  const newValue =
    isDate(value) && (!props.disabledDate || !props.disabledDate(value as Date))
      ? format(value as Date, props.format)
      : '';
  // Required to avoid desynchronization of values
  if (imaskInstance.value) {
    imaskInstance.value.masked.value = newValue;
  }

  model.value = newValue;
}

function handleUpdateValue(value?: string) {
  if (!value) {
    handleEmitValue(null);
    return;
  }

  const parsed = parse(value, props.format, props.modelValue || getNewDate());
  if (isValid(parsed) && value.length >= props.format.length) {
    const daysInMonth = getDaysInMonth(parsed);
    const day = parsed.getDate();

    if (day <= daysInMonth) {
      if (props.disabledDate && props.disabledDate(parsed)) {
        return;
      }

      handleEmitValue(parsed);
    }
  }
}

function handleEmitValue(value: Date | null) {
  if (props.disabled || props.readonly) return;

  emit('update:model-value', value);
}

function handleFocus(event: Event) {
  emit('focus', event);
}

function handleBlur(event?: Event) {
  const parsed = parse(
    model.value,
    props.format,
    props.modelValue || getNewDate()
  );

  if (!isValid(parsed) || (props.disabledDate && props.disabledDate(parsed))) {
    if (!props.modelValue) {
      imaskInstance.value?.masked.reset();
    }

    updateInternalModel(props.modelValue);
  }

  emit('blur', event);
}

function focus() {
  input.value?.focus();
}

function blur() {
  input.value?.blur();
}

function remove() {
  model.value = '';
}

updateInternalModel(props.modelValue);

onMounted(() => {
  if (input.value) {
    imaskInstance.value = IMask(input.value, {
      mask: props.format,
      blocks: inputBlocks,
    });
    imaskInstance.value.on('accept', () => {
      handleUpdateValue(imaskInstance.value?.value);
    });
  }
});

onBeforeUnmount(() => {
  if (imaskInstance.value) {
    imaskInstance.value.destroy();
  }
});

defineExpose({ focus, blur, remove });
</script>

<style lang="scss" scoped>
.app-date-input {
  font: var(--vpick--input-font);
}
</style>
