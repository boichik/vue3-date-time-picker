<template>
  <div class="app-time-picker-default-mode">
    <AppTimeController v-model="model" :selectable-range="selectableRange" />
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type { AppTimePickerComponentData } from '../../../interfaces/index.interface';
import { computed, inject } from 'vue';
import AppTimeController from '../../controller/AppController.vue';
import {
  leadToValidDateRelativeToRange,
  parseSelectableRange,
} from '../../../utils';
import { AppTimePickerComponentDataProvide } from '../../../const';
import { isDate } from '@/utils/isDate';

const model = defineModel<Date | null>({ default: null });

const appTimePickerComponentData =
  inject<ComputedRef<AppTimePickerComponentData> | null>(
    AppTimePickerComponentDataProvide,
    null
  );

const selectableRange = computed(
  () => appTimePickerComponentData?.value.selectableRange
);

const defaultTime = computed<Date | undefined>(
  () => appTimePickerComponentData?.value.startDefaultTime
);

function prepareModel() {
  let value: Date | null | undefined = isDate(model.value)
    ? model.value
    : defaultTime.value;

  if (!value) {
    model.value = null;
    return;
  }

  value = leadToValidDateRelativeToRange(
    value,
    parseSelectableRange(selectableRange.value, value)
  );

  if (
    appTimePickerComponentData?.value.isDisabledDate &&
    Boolean(appTimePickerComponentData.value.isDisabledDate(value))
  ) {
    value = null;
  }
  model.value = value;
}

prepareModel();
</script>
