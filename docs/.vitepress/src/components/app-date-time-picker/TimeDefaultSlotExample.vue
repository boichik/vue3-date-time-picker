<template>
  <AppTimePicker v-model="model">
    <template #default="{ value, popoverVisible, input, focus }">
      <input
        :value="dateToStringTime(value)"
        :class="{ 'custom-input--focus': popoverVisible }"
        class="custom-input"
        :placeholder="placeholder"
        @focus="focus"
        @input="event => stringDateToDate(event, input)"
      />
    </template>
  </AppTimePicker>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format, isDate, parse } from 'date-fns';

const { placeholder = 'Select time' } = defineProps<{ placeholder?: string }>();

const model = ref(null);

const timeFormat = 'HH:ss:mm';

function dateToStringTime(value: Date | null) {
  if (!value || !isDate(value)) return '';

  return format(value, timeFormat);
}

function stringDateToDate(event: InputEvent, cb: (value: unknown) => void) {
  const value = (event.target as HTMLInputElement).value;

  const parsed = parse(value, timeFormat, new Date());

  if (!value) {
    cb(null);
  }

  if (value.length === timeFormat.length && isDate(parsed)) {
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
