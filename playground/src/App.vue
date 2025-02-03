<template>
  <AppDateTimePicker v-model="model" />
  <AppTimePicker v-model="model" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref(null);
</script>
