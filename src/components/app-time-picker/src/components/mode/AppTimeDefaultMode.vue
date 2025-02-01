<template>
  <div class="app-time-picker-default-mode">
    <AppTimeController v-model="model" :selectable-range="selectableRange" />
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type { AppTimePickerComponentData } from '../../interfaces';
import { computed, inject } from 'vue';
import AppTimeController from '../controller/AppTimeController.vue';
import {
  leadToValidDateRelativeToRange,
  parseSelectableRange,
} from '../../utils';
import { isDate } from 'date-fns';
import { AppTimePickerComponentDataProvide } from '../../const';

const model = defineModel<Date | null>({ default: null });

const appTimePickerComponentData =
  inject<ComputedRef<AppTimePickerComponentData> | null>(
    AppTimePickerComponentDataProvide,
    null
  );

const selectableRange = computed(
  () => appTimePickerComponentData?.value.selectableRange
);

const defaultTime = computed<Date>(
  () => appTimePickerComponentData!.value.startDefaultTime
);

function prepareModel() {
  let value: Date | null = isDate(model.value)
    ? model.value
    : defaultTime.value;

  value = leadToValidDateRelativeToRange(
    value,
    parseSelectableRange(selectableRange.value, value)
  );

  if (
    appTimePickerComponentData?.value.isDisabledDate &&
    !!appTimePickerComponentData.value.isDisabledDate(value)
  ) {
    value = null;
  }

  model.value = value;
}

prepareModel();
</script>
