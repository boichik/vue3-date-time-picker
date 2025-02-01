<template>
  <div class="ui-date-time-range-mode">
    <div class="ui-date-time-range-mode__section">
      <AppTimePicker
        v-model="selectedStartDate"
        :clearable="timePickerOptions.clearable"
        :format="timePickerOptions.format"
        :placeholder="timePickerOptions.startPlaceholder"
        :default-time="timePickerOptions.defaultTimeStart"
        :append-to-body="false"
      />
      <AppDateTimeController
        v-model="startDateDisplay"
        :selected-date="selectedStartDate"
        mode="day"
      />
    </div>
    <div class="ui-date-time-range-mode__section">
      <AppTimePicker
        v-model="selectedEndDate"
        :clearable="timePickerOptions.clearable"
        :format="timePickerOptions.format"
        :placeholder="timePickerOptions.endPlaceholder"
        :default-time="timePickerOptions.defaultTimeEnd"
        :append-to-body="false"
      />
      <AppDateTimeController
        v-model="endDateDisplay"
        :selected-date="selectedEndDate"
        mode="day"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppDateTimeController from '../controller/AppDateTimeController.vue';
import { AppTimePicker } from '@/components/app-time-picker';
import type { AppDateTimePickerComponentData } from '../../interfaces';
import type { ComputedRef } from 'vue';
import { computed, inject, provide, ref, watch } from 'vue';
import { isBefore, addMonths, isSameDay, isDate, format } from 'date-fns';
import { setTime } from '../../utils';
import { getNewDate } from '@/utils/getNewDate';
import { AppTimePickerInternalSettingsProvide } from '@/components/app-time-picker/src/const';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerTableComponentDataProvide,
} from '../../const';
import type { AppTimePickerInternalSettings } from '@/components/app-time-picker/src/interfaces';
import { AppDateTimePopoverInternalSettingsProvide } from '@/const/globalProvide.const';

const emit = defineEmits(['update:model-value', 'changeMode']);
const props = defineProps<{ modelValue?: undefined[] | Date[] }>();

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const selectedStartDate = ref<Date | undefined>(
  parseModel(props.modelValue, 0)
);
const selectedEndDate = ref<Date | undefined>(parseModel(props.modelValue, 1));
const hoverDateRange = ref<Date | null>(null);
const isInternalUpdate = ref<boolean>(false);

const today = computed(
  () => appDateTimePickerComponentData?.value?.today || getNewDate()
);

const timePickerOptions = computed(() => {
  const { clearable, timeFormat, timeOptions } =
    appDateTimePickerComponentData?.value || {};

  const { endPlaceholder, startPlaceholder } = timeOptions || {};

  return {
    clearable,
    format: timeFormat,
    startPlaceholder,
    endPlaceholder,
    defaultTimeStart: getDefaultTime(),
    defaultTimeEnd: getDefaultTime(1),
  };
});

const startDateDisplay = ref(
  selectedStartDate.value || timePickerOptions.value.defaultTimeStart
);
const endDateDisplay = ref(
  getEndDateDisplay(selectedStartDate.value, selectedEndDate.value)
);

watch(
  () => props.modelValue,
  val => {
    if (isInternalUpdate.value) {
      isInternalUpdate.value = false;
      return;
    }
    const startDate = parseModel(val, 0);
    const endDate = parseModel(val, 1);

    if (!!startDate) {
      startDateDisplay.value = startDate as Date;
    }

    if (!!endDate) {
      endDateDisplay.value = getEndDateDisplay(startDate, endDate);
    }

    selectedStartDate.value = startDate;
    selectedEndDate.value = endDate;
  }
);

watch([selectedStartDate, selectedEndDate], ([newStart, newEnd]) => {
  if (!!newStart && !!newEnd) {
    isInternalUpdate.value = !isBefore(newEnd, newStart);

    const value = isBefore(newEnd, newStart)
      ? [newEnd, newStart]
      : [newStart, newEnd];
    emit('update:model-value', value);
  }
});

watch(startDateDisplay, (newStartDate: Date) => {
  if (
    isBefore(endDateDisplay.value, newStartDate) ||
    isSameDay(newStartDate, endDateDisplay.value)
  ) {
    endDateDisplay.value = addMonths(newStartDate, 1);
  }
});

watch(endDateDisplay, (newEndDate: Date) => {
  if (
    isBefore(newEndDate, startDateDisplay.value) ||
    isSameDay(newEndDate, startDateDisplay.value)
  ) {
    startDateDisplay.value = addMonths(newEndDate, -1);
  }
});

function getDefaultTime(index = 0) {
  const value = appDateTimePickerComponentData?.value?.defaultTime;
  if (value && Array.isArray(value) && value[index]) {
    return setTime(today.value, value[index]);
  }

  return today.value;
}

function parseModel(val: undefined | undefined[] | Date[], index: number) {
  if (Array.isArray(val) && val[index] && isDate(val[index])) {
    return val[index];
  }

  return undefined;
}

function getEndDateDisplay(
  startDate: Date | undefined,
  endDate: Date | undefined
) {
  if (endDate) {
    if (
      startDate &&
      (isBefore(endDate, startDate) || isSameDay(startDate, endDate))
    ) {
      return setTimeForSelectedDate(addMonths(startDate, 1), true);
    }
    return endDate;
  }

  return setTimeForSelectedDate(addMonths(startDateDisplay.value, 1), true);
}

function setTimeForSelectedDate(date: Date, isEndDate?: boolean) {
  const index = isEndDate ? 1 : 0;

  return setTime(
    date,
    appDateTimePickerComponentData?.value?.defaultTime || [
      format(today.value, 'HH:mm:ss'),
      format(today.value, 'HH:mm:ss'),
    ],
    index
  );
}

function selectDate(date: Date) {
  if (!selectedStartDate.value) {
    selectedStartDate.value = setTimeForSelectedDate(date);
  } else if (!selectedEndDate.value) {
    selectedEndDate.value = setTimeForSelectedDate(date, true);
    if (isBefore(selectedEndDate.value, selectedStartDate.value)) {
      [selectedStartDate.value, selectedEndDate.value] = [
        selectedEndDate.value,
        selectedStartDate.value,
      ];
    }
  } else {
    selectedStartDate.value = setTimeForSelectedDate(date);
    selectedEndDate.value = undefined;
  }
  hoverDateRange.value = null;
}

function isSelectedDate(date: Date, isOtherMonth: boolean) {
  if (isOtherMonth) return null;

  const startDate = selectedStartDate.value;
  const endDate = selectedEndDate.value;
  const hoverDate = hoverDateRange.value;

  if (startDate && hoverDate) {
    if (isSameDay(hoverDate, date)) {
      return isSameDay(startDate, hoverDate)
        ? 'center'
        : startDate > hoverDate
          ? 'left'
          : 'right';
    }
    if (isSameDay(startDate, date) && hoverDate < date) {
      return 'right';
    }
  }

  if (startDate && endDate) {
    if (isSameDay(startDate, date) && isSameDay(endDate, date)) {
      return 'center';
    }
  }

  if (startDate && isSameDay(startDate, date)) return 'left';
  if (endDate && isSameDay(endDate, date)) return 'right';

  return null;
}

function isDateInRange(date: Date, isOtherMonth: boolean) {
  if (isOtherMonth) return false;
  return (
    selectedStartDate.value &&
    selectedEndDate.value &&
    date >= selectedStartDate.value &&
    date <= selectedEndDate.value
  );
}

function isDateHoverRange(date: Date, isOtherMonth: boolean) {
  if (isOtherMonth) return false;

  return (
    !!selectedStartDate.value &&
    !!hoverDateRange.value &&
    ((date >= selectedStartDate.value && date <= hoverDateRange.value) ||
      (date <= selectedStartDate.value && date >= hoverDateRange.value))
  );
}

function hoverDate(date: Date) {
  if (selectedStartDate.value && !selectedEndDate.value) {
    hoverDateRange.value = date;
  }
}

function resetHover() {
  hoverDateRange.value = null;
}

const dayTableData = {
  isDateInRange: (date: Date, isOtherMonth: boolean) =>
    isDateInRange(date, isOtherMonth),
  isSelectedDate: (date: Date, isOtherMonth: boolean) =>
    isSelectedDate(date, isOtherMonth),
  isDateHoverRange: (date: Date, isOtherMonth: boolean) =>
    isDateHoverRange(date, isOtherMonth),
  hoverDate: (date: Date) => hoverDate(date),
  selectDate: (date: Date) => selectDate(date),
  resetHover: () => resetHover(),
};

provide<AppTimePickerInternalSettings>(AppTimePickerInternalSettingsProvide, {
  isDisabledDate: appDateTimePickerComponentData?.value.disabledDate,
});

provide(AppDateTimePopoverInternalSettingsProvide, { forceUpdate: true });

provide(AppDateTimePickerTableComponentDataProvide, dayTableData);
</script>

<style lang="scss" scoped>
.ui-date-time-range-mode {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: var(--vpick--table-range-gap);
}
</style>
