<template>
  <AppDateTimePicker
    v-model="model"
    :shortcuts="shortcuts"
    :placeholder="props.placeholder"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: 'Select date',
});

const model = ref(null);

const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Next Monday',
    value: (() => {
      const today = new Date();
      const nextMonday = new Date(
        today.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7))
      );
      return nextMonday;
    })(),
  },
  {
    text: 'A week later',
    value: new Date(new Date().setDate(new Date().getDate() + 7)),
  },
];
</script>
