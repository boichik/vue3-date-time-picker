<template>
  <div>
    <AppDateTimePicker
      v-model="model"
      timezone="America/New_York"
      type="datetime"
    />
  </div>
</template>

<script setup lang="ts">
const model = defineModel();
</script>
