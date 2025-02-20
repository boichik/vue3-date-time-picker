<template>
  <div class="ui-date-time-mode">
    <AppTimePicker
      v-if="isTimeMode"
      ref="timePicker"
      v-model="model"
      :clearable="timePickerOptions.clearable"
      :format="timePickerOptions.format"
      :placeholder="timePickerOptions.placeholder"
      :default-time="defaultTime"
      :append-to-body="false"
    />
    <AppDateTimeController
      v-model="currentDateDisplay"
      :selected-date="model"
    />
  </div>
</template>

<script setup lang="ts">
import AppDateTimeController from '../controller/AppDateTimeController.vue';
import type { ComputedRef } from 'vue';
import { provide, ref, inject, watch, computed } from 'vue';
import { setTime } from '../../utils';
import { isDate } from '@/utils/isDate';
import { AppTimePicker } from '@/components/app-time-picker';
import { format } from 'date-fns';
import { getNewDate } from '@/utils/getNewDate';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
} from '../../const';
import { AppTimePickerInternalSettingsProvide } from '@/components/app-time-picker/src/const';
import type {
  AppTimePickerExpose,
  AppTimePickerInternalSettings,
} from '@/components/app-time-picker/src/interfaces';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerGlobalTableComponentData,
} from '../../interfaces';
import { AppDateTimePopoverInternalSettingsProvide } from '@/const/globalProvide.const';
import { AppDateTimePickerType } from '../../enums/dateTimePickerType';

const timePicker = ref<AppTimePickerExpose | null>(null);

const model = defineModel<Date | null>({ default: null });

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const isTimeMode = computed(
  () =>
    appDateTimePickerComponentData?.value.type ===
    AppDateTimePickerType.DateTime
);

const today = computed(
  () => appDateTimePickerComponentData?.value?.today || getNewDate()
);

const defaultTime = computed(() => {
  const value = appDateTimePickerComponentData?.value?.defaultTime;

  if (!value || (Array.isArray(value) && !value.length)) {
    if (!isTimeMode.value) {
      return setTime(today.value);
    }

    return today.value;
  }

  if (Array.isArray(value)) {
    return setTime(today.value, value[0]);
  }
  return setTime(today.value, value);
});

const currentDateDisplay = ref<Date>(model.value || defaultTime.value);

const timePickerOptions = computed(() => {
  const { clearable, timeFormat, timeOptions } =
    appDateTimePickerComponentData?.value || {};

  const { placeholder } = timeOptions || {};

  return {
    clearable,
    format: timeFormat,
    placeholder,
  };
});

watch(
  () => model.value,
  val => {
    if (isDate(val)) {
      currentDateDisplay.value = val as Date;
    }
  }
);

if (isTimeMode.value) {
  provide<AppTimePickerInternalSettings>(AppTimePickerInternalSettingsProvide, {
    isDisabledDate: appDateTimePickerComponentData?.value.disabledDate,
  });

  provide(AppDateTimePopoverInternalSettingsProvide, { forceUpdate: true });
}

const globalTableComponentData: AppDateTimePickerGlobalTableComponentData = {
  select: (date: Date) => {
    model.value = setTime(date, format(defaultTime.value, 'HH:mm:ss'));
  },
};

provide<AppDateTimePickerGlobalTableComponentData>(
  AppDateTimePickerGlobalTableComponentDataProvide,
  globalTableComponentData
);
</script>
