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
      v-show="showComponent(DateTimePickerMode.Day)"
      v-bind="componentBinds"
      v-on="componentListener"
    />

    <AppMonthTable
      v-show="showComponent(DateTimePickerMode.Month)"
      v-bind="componentBinds"
      v-on="componentListener"
    />

    <AppYearTable
      v-show="showComponent(DateTimePickerMode.Year)"
      v-bind="componentBinds"
      v-on="componentListener"
    />
  </div>
</template>

<script setup lang="ts">
import AppDayTable from '../table/AppDayTable.vue';
import AppMonthTable from '../table/AppMonthTable.vue';
import AppYearTable from '../table/AppYearTable.vue';
import { computed, ref, watch } from 'vue';
import { DateTimePickerMode } from '../../enums/dateTimePickerMode';
import { addMonths, subMonths, addYears, subYears } from 'date-fns';
import AppDateTimePanel from '../panel/AppDateTimePanel.vue';

const props = defineProps<{
  selectedDate?: Date | null;
  mode: DateTimePickerMode;
}>();

const panel = ref<{
  handleSelectByScroll: (event: WheelEvent) => void;
} | null>(null);

const model = defineModel<Date>({ required: true });

const mode = ref<DateTimePickerMode>(props.mode || DateTimePickerMode.Day);

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
  () => props.mode,
  value => {
    if (value && Object.values(DateTimePickerMode).includes(value)) {
      mode.value = value;
    }
  }
);

function handleScroll(event: WheelEvent) {
  if (panel.value && panel.value.handleSelectByScroll) {
    panel.value.handleSelectByScroll(event);
  }
}

function handleUpdateCurrentDateDisplay(val: Date) {
  model.value = val;
}

function handleUpdateCurrentDateFromYearOrMonthTable(val: Date) {
  handleUpdateCurrentDateDisplay(val);

  if (DateTimePickerMode.Month === mode.value) {
    mode.value = props.mode;
  }

  if (DateTimePickerMode.Year === mode.value) {
    mode.value = DateTimePickerMode.Month;
  }
}

function showComponent(value: DateTimePickerMode) {
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

function handleChangeMode(val: DateTimePickerMode) {
  mode.value = val;
}
</script>
