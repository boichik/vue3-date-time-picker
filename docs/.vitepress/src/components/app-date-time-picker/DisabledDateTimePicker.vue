<template>
  <p>{{ props.firstText }}:</p>
  <AppDateTimePicker
    v-model="modelOne"
    :disabled-date="isDateDisabledBeforeToday"
    :placeholder="props.placeholder"
  />
  <p>{{ props.lastText }}:</p>
  <AppDateTimePicker
    v-model="modelTwo"
    :disabled-date="isDateNotInRange"
    :placeholder="props.placeholder"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  firstText: string;
  lastText: string;
  placeholder: string;
}>();

const modelOne = ref(null);
const modelTwo = ref(null);

function isDateDisabledBeforeToday(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isDateNotInRange(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoDaysBefore = new Date(today);
  twoDaysBefore.setDate(today.getDate() - 2);

  const twoDaysAfter = new Date(today);
  twoDaysAfter.setDate(today.getDate() + 2);

  return date <= twoDaysBefore || date >= twoDaysAfter;
}
</script>
