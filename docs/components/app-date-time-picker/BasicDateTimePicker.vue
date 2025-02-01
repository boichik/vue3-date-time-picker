<template>
  <AppDateTimePicker
    v-model="model"
    :type="props.type"
    :date-format="props.dateFormat"
    :time-format="props.timeFormat"
    :default-time="props.defaultTime"
    :combine-formats="props.combineFormats"
    :placeholder="props.placeholder"
    :time-options="props.timeOptions"
    :start-placeholder="props.startPlaceholder"
    :end-placeholder="props.endPlaceholder"
    :stay-opened="props.stayOpened"
  />
</template>

<script setup lang="ts">
import type { AppDateTimePickerProps } from '../../../src/components/app-date-time-picker';
import { ref } from 'vue';

const props = defineProps<AppDateTimePickerProps>();

const model = ref(null);
</script>
