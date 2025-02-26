<template>
  <AppDateTimePicker v-model="model">
    <template #default="{ value, popoverVisible, input, focus }">
      <input
        :value="dateToStringDate(value)"
        :class="{ 'custom-input--focus': popoverVisible }"
        class="custom-input"
        :placeholder="placeholder"
        @focus="focus"
        @input="event => stringDateToDate(event, input)"
      />
    </template>
  </AppDateTimePicker>
</template>

<script setup lang="ts">
import { format, isDate, parse } from 'date-fns';
import { ref } from 'vue';

const { placeholder = 'Select date' } = defineProps<{ placeholder?: string }>();

const model = ref(null);

const dateFormat = 'yyyy-MM-dd';

function dateToStringDate(value: Date | null) {
  if (!value || !isDate(value)) return '';

  return format(value, dateFormat);
}

function stringDateToDate(event: InputEvent, cb: (value: unknown) => void) {
  const value = (event.target as HTMLInputElement).value;

  const parsed = parse(value, dateFormat, new Date());

  if (!value) {
    cb(null);
  }

  if (value.length === dateFormat.length && isDate(parsed)) {
    cb(parsed);
  }
}
</script>

<style lang="scss" scoped>
.custom-input {
  width: 100%;
  border: 1px solid;

  &:focus,
  &--focus {
    border-color: blue;
  }
}
</style>
