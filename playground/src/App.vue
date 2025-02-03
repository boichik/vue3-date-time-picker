<template>
  <AppDateTimePicker v-model="model" />
  <AppTimePicker v-model="model" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  AppDateTimePicker,
  AppTimePicker,
} from '@boichikpro/vue3-datetime-picker';

const model = ref(null);
</script>
