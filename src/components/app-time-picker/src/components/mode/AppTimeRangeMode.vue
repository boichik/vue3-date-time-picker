<template>
  <div class="app-time-picker-range-mode">
    <section class="app-time-picker-range-mode__section">
      <AppTimeController
        v-model="startModel"
        :selectable-range="startSelectableRange"
      />
    </section>

    <section class="app-time-picker-range-mode__section">
      <AppTimeController
        v-model="endModel"
        :selectable-range="endSelectableRange"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type {
  AppTimePickerComponentData,
  AppTimePickerModel,
} from '../../interfaces';
import { computed, inject, ref, watch } from 'vue';
import AppTimeController from '../controller/AppTimeController.vue';
import { isDate } from '@/utils/isDate';
import {
  convertDateToTime,
  leadToValidDateRelativeToRange,
  parseSelectableRange,
} from '../../utils';
import { AppTimePickerComponentDataProvide } from '../../const';

const model = defineModel<AppTimePickerModel>({ default: [null, null] });

function prepareModel(value: AppTimePickerModel, index = 0) {
  if (Array.isArray(value) && value.length && isDate(value[index])) {
    return value[index];
  }

  return null;
}

const startModel = ref<Date | null>(null);
const endModel = ref<Date | null>(null);
const isInternalUpdate = ref<boolean>(false);

watch(
  () => model.value,
  val => {
    if (isInternalUpdate.value) {
      isInternalUpdate.value = false;
      return;
    }
    startModel.value = prepareModel(val);
    endModel.value = prepareModel(val, 1);
  }
);

watch([startModel, endModel], ([newStart, newEnd]) => {
  if (!!newStart && !!newEnd) {
    isInternalUpdate.value = true;
    model.value = [newStart, newEnd];
  }
});

const appTimePickerComponentData =
  inject<ComputedRef<AppTimePickerComponentData> | null>(
    AppTimePickerComponentDataProvide,
    null
  );

const startSelectableRange = computed(() => getSelectableRange());
const endSelectableRange = computed(() => getSelectableRange(1));

function getSelectableRange(index = 0) {
  const { startSelectableRange, endSelectableRange } =
    appTimePickerComponentData?.value || {};

  if (index === 0 && startSelectableRange) {
    return startSelectableRange;
  }

  if (index === 1 && endSelectableRange) {
    return endSelectableRange;
  }

  const selectedModel = index === 0 ? endModel.value : startModel.value;

  const template = (val: string) =>
    index === 0 ? `00:00:00 - ${val}` : `${val} - 23:59:59`;

  const time = convertDateToTime(selectedModel);

  const rangeFromModel = time ? template(time) : undefined;

  return rangeFromModel;
}

const defaultTime = computed<Date[]>(() => {
  const { startDefaultTime, endDefaultTime } =
    appTimePickerComponentData!.value || {};

  return [startDefaultTime, endDefaultTime];
});

function getValueForModel(index = 0) {
  const value = prepareModel(model.value, index) ?? defaultTime.value[index];
  const range = index ? endSelectableRange.value : startSelectableRange.value;

  return leadToValidDateRelativeToRange(
    value,
    parseSelectableRange(range, value)
  );
}

function prepareModelWithDefaults() {
  startModel.value = getValueForModel();
  endModel.value = getValueForModel(1);
}

prepareModelWithDefaults();
</script>

<style lang="scss" scoped>
.app-time-picker-range-mode {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
</style>
