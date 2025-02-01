<template>
  <div class="ui-date-mode">
    <AppDateTimeController
      v-model="currentDateDisplay"
      :selected-date="model"
      mode="day"
    />
  </div>
</template>

<script setup lang="ts">
import AppDateTimeController from '../controller/AppDateTimeController.vue';
import type { ComputedRef } from 'vue';
import { provide, ref, inject, watch } from 'vue';
import { setTime } from '../../utils';
import { isDate } from '@/utils/isDate';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerTableComponentDataProvide,
} from '../../const';
import type { AppDateTimePickerComponentData } from '../../interfaces';

const model = defineModel<Date | null>({ default: null });

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const currentDateDisplay = ref<Date>(
  model.value ||
    setTime(new Date(), appDateTimePickerComponentData?.value?.defaultTime)
);

watch(
  () => model.value,
  val => {
    if (isDate(val)) {
      currentDateDisplay.value = val as Date;
    }
  }
);

provide(AppDateTimePickerTableComponentDataProvide, {
  selectDate: (date: Date) => {
    model.value = setTime(
      date,
      appDateTimePickerComponentData?.value?.defaultTime
    );
  },
});
</script>
