<template>
  <AppDateTimePanel
    ref="panel"
    :value="props.selectedDate"
    :mode="mode"
    :current-date="model"
    @prev-year="prevYear"
    @prev-month="prevMonth"
    @next-month="nextMonth"
    @next-year="nextYear"
    @change-mode="handleChangeMode"
  />

  <div class="app-date-time-controller-content" @wheel="handleScroll">
    <AppDayTable
      v-show="showComponent(AppDateTimePickerMode.Day)"
      v-bind="componentBinds"
      v-on="componentListener"
    />

    <AppMonthTable
      v-show="showComponent(AppDateTimePickerMode.Month)"
      v-bind="componentBinds"
      v-on="componentListener"
    />

    <AppYearTable
      v-show="showComponent(AppDateTimePickerMode.Year)"
      v-bind="componentBinds"
      v-on="componentListener"
    />
  </div>
</template>

<script setup lang="ts">
import AppDayTable from '../table/AppDayTable.vue';
import AppMonthTable from '../table/AppMonthTable.vue';
import AppYearTable from '../table/AppYearTable.vue';
import { computed, inject, ref, watch, type ComputedRef } from 'vue';
import { AppDateTimePickerMode } from '../../enums/dateTimePickerMode';
import { addMonths, subMonths, addYears, subYears } from 'date-fns';
import AppDateTimePanel from '../panel/AppDateTimePanel.vue';
import { AppDateTimePickerComponentDataProvide } from '../../const';
import type { AppDateTimePickerComponentData } from '../../interfaces';

const props = defineProps<{
  selectedDate?: Date | null;
}>();

const panel = ref<{
  handleSelectByScroll: (event: WheelEvent) => void;
} | null>(null);

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const globalMode = computed(() => appDateTimePickerComponentData?.value.mode);

const model = defineModel<Date>({ required: true });

const mode = ref<AppDateTimePickerMode>(
  globalMode.value || AppDateTimePickerMode.Day
);

const componentBinds = computed(() => {
  return {
    value: props.selectedDate,
    currentDate: model.value,
  };
});

const componentListener = computed(() => {
  return {
    update: handleUpdateCurrentDateFromYearOrMonthTable,
  };
});

watch(
  () => globalMode.value,
  value => {
    if (value) mode.value = value;
  }
);

function handleScroll(event: WheelEvent) {
  event.preventDefault();

  if (panel.value && panel.value.handleSelectByScroll) {
    panel.value.handleSelectByScroll(event);
  }
}

function handleUpdateCurrentDateDisplay(val: Date) {
  model.value = val;
}

function handleUpdateCurrentDateFromYearOrMonthTable(val: Date) {
  handleUpdateCurrentDateDisplay(val);

  if (
    AppDateTimePickerMode.Month === mode.value &&
    globalMode.value === AppDateTimePickerMode.Day
  ) {
    mode.value = AppDateTimePickerMode.Day;
  }

  if (
    AppDateTimePickerMode.Year === mode.value &&
    globalMode.value !== AppDateTimePickerMode.Year
  ) {
    mode.value = AppDateTimePickerMode.Month;
  }
}

function showComponent(value: AppDateTimePickerMode) {
  return mode.value === value;
}

function prevMonth(val: number) {
  handleUpdateCurrentDateDisplay(subMonths(model.value, val));
}
function nextMonth(val: number) {
  handleUpdateCurrentDateDisplay(addMonths(model.value, val));
}
function prevYear(val: number) {
  handleUpdateCurrentDateDisplay(subYears(model.value, val));
}
function nextYear(val: number) {
  handleUpdateCurrentDateDisplay(addYears(model.value, val));
}

function handleChangeMode(val: AppDateTimePickerMode) {
  mode.value = val;
}
</script>
