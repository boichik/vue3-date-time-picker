<template>
  <div class="ui-date-time-range-mode">
    <div ref="firstSection" class="ui-date-time-range-mode__section">
      <AppTimePicker
        v-if="isTimeMode"
        v-model="selectedStartDate"
        :clearable="timePickerOptions.clearable"
        :format="timePickerOptions.format"
        :placeholder="timePickerOptions.startPlaceholder"
        :apply-text="timePickerOptions.applyText"
        :cancel-text="timePickerOptions.cancelText"
        :default-time="timePickerOptions.defaultTimeStart"
        :append-to-body="false"
      />
      <AppDateTimeController
        v-model="startDateDisplay"
        :selected-date="selectedStartDate"
      />
    </div>
    <div v-show="isFullyVisible" class="ui-date-time-range-mode__section">
      <AppTimePicker
        v-if="isTimeMode"
        v-model="selectedEndDate"
        :clearable="timePickerOptions.clearable"
        :format="timePickerOptions.format"
        :placeholder="timePickerOptions.endPlaceholder"
        :apply-text="timePickerOptions.applyText"
        :cancel-text="timePickerOptions.cancelText"
        :default-time="timePickerOptions.defaultTimeEnd"
        :append-to-body="false"
      />
      <AppDateTimeController
        v-model="endDateDisplay"
        :selected-date="selectedEndDate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppDateTimeController from '../controller/AppDateTimeController.vue';
import { AppTimePicker } from '@/components/app-time-picker';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerDayTableComponentData,
  AppDateTimePickerMonthTableComponentData,
  AppDateTimePickerYearTableComponentData,
} from '../../interfaces';
import type { ComputedRef } from 'vue';
import { computed, inject, provide, ref, watch, useTemplateRef } from 'vue';
import {
  isBefore,
  addMonths,
  isSameDay,
  isDate,
  format,
  addYears,
  subMonths,
  subYears,
  isSameMonth,
  isSameYear,
} from 'date-fns';
import { setTime } from '../../utils';
import { getNewDate } from '@/utils/getNewDate';
import { AppTimePickerInternalSettingsProvide } from '@/components/app-time-picker/src/const';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerDayTableComponentDataProvide,
  AppDateTimePickerMonthTableComponentDataProvide,
  AppDateTimePickerYearTableComponentDataProvide,
} from '../../const';
import type { AppTimePickerInternalSettings } from '@/components/app-time-picker/src/interfaces';
import { AppDateTimePopoverInternalSettingsProvide } from '@/const/globalProvide.const';
import { AppDateTimePickerType } from '../../enums/dateTimePickerType';
import { AppDateTimePickerMode } from '../../enums/dateTimePickerMode';
import { useIsFullyVisibleRangeContent } from '@/composables/useIsFullyVisibleRangeContent';

const emit = defineEmits(['update:model-value', 'changeMode']);
const props = defineProps<{ modelValue?: (Date | null)[] }>();

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

const firstSection = useTemplateRef<HTMLElement | null>('firstSection');

const { isFullyVisible } = useIsFullyVisibleRangeContent(firstSection);

const isTimeMode = computed(
  () =>
    appDateTimePickerComponentData?.value.type ===
    AppDateTimePickerType.DateTimeRange
);

const today = computed(
  () => appDateTimePickerComponentData?.value?.today || getNewDate()
);

const globalMode = computed(() => appDateTimePickerComponentData?.value.mode);

const displacementNumber = computed(() => {
  if (AppDateTimePickerMode.Year === globalMode.value) {
    return 10;
  } else {
    return 1;
  }
});

const timePickerOptions = computed(() => {
  const { clearable, timeFormat, timeOptions } =
    appDateTimePickerComponentData?.value || {};

  const { endPlaceholder, startPlaceholder, applyText, cancelText } =
    timeOptions || {};

  return {
    clearable,
    format: timeFormat,
    startPlaceholder,
    endPlaceholder,
    applyText,
    cancelText,
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
    endDateDisplay.value = addMonthsOrYears(newStartDate);
  }
});

watch(endDateDisplay, (newEndDate: Date) => {
  if (
    isBefore(newEndDate, startDateDisplay.value) ||
    isSameDay(newEndDate, startDateDisplay.value)
  ) {
    startDateDisplay.value = subMonthsOrYears(newEndDate);
  }
});

function getDefaultTime(index = 0) {
  const value = appDateTimePickerComponentData?.value?.defaultTime;
  if (value && Array.isArray(value) && value[index]) {
    return setTime(today.value, value[index]);
  }

  return today.value;
}

function parseModel(val: unknown, index: number) {
  if (Array.isArray(val) && val[index] && isDate(val[index])) {
    return val[index];
  }

  return undefined;
}

function subMonthsOrYears(date: Date) {
  if (globalMode.value === AppDateTimePickerMode.Day) {
    return subMonths(date, displacementNumber.value);
  }

  return subYears(date, displacementNumber.value);
}

function addMonthsOrYears(date: Date) {
  if (globalMode.value === AppDateTimePickerMode.Day) {
    return addMonths(date, displacementNumber.value);
  }

  return addYears(date, displacementNumber.value);
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
      return setTimeForSelectedDate(addMonthsOrYears(startDate), true);
    }
    return endDate;
  }

  return setTimeForSelectedDate(addMonthsOrYears(startDateDisplay.value), true);
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

function isSameDate(
  date: Date,
  cb: (dateLeft: Date, dateRight: Date) => boolean
) {
  const startDate = selectedStartDate.value;
  const endDate = selectedEndDate.value;
  const hoverDate = hoverDateRange.value;

  if (startDate && hoverDate) {
    if (cb(hoverDate, date)) {
      return cb(startDate, hoverDate)
        ? 'center'
        : startDate > hoverDate
          ? 'left'
          : 'right';
    }
    if (cb(startDate, date) && hoverDate < date) {
      return 'right';
    }
  }

  if (startDate && endDate) {
    if (cb(startDate, date) && cb(endDate, date)) {
      return 'center';
    }
  }

  if (startDate && cb(startDate, date)) return 'left';
  if (endDate && cb(endDate, date)) return 'right';

  return false;
}

function isDateInRange(date: Date, isOtherMonth: boolean) {
  if (isOtherMonth) return false;
  return !!(
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

if (isTimeMode.value) {
  provide<AppTimePickerInternalSettings>(AppTimePickerInternalSettingsProvide, {
    isDisabledDate: appDateTimePickerComponentData?.value.disabledDate,
  });

  provide(AppDateTimePopoverInternalSettingsProvide, { forceUpdate: true });
}

const dayTableData: AppDateTimePickerDayTableComponentData = {
  inRange: isDateInRange,
  isSelected: (date: Date, isOtherMonth: boolean) =>
    !isOtherMonth && isSameDate(date, isSameDay),
  isHoverRange: isDateHoverRange,
  hover: hoverDate,
  select: selectDate,
  resetHover: resetHover,
};

const monthTableData: AppDateTimePickerMonthTableComponentData = {
  inRange: date => isDateInRange(date, false),
  isSelected: date => isSameDate(date, isSameMonth),
  isHoverRange: date => isDateHoverRange(date, false),
  hover: hoverDate,
  select: selectDate,
  resetHover: resetHover,
};

const yearTableData: AppDateTimePickerYearTableComponentData = {
  inRange: date => isDateInRange(date, false),
  isSelected: date => isSameDate(date, isSameYear),
  isHoverRange: date => isDateHoverRange(date, false),
  hover: hoverDate,
  select: selectDate,
  resetHover: resetHover,
};

provide<AppDateTimePickerDayTableComponentData>(
  AppDateTimePickerDayTableComponentDataProvide,
  dayTableData
);

provide<AppDateTimePickerMonthTableComponentData>(
  AppDateTimePickerMonthTableComponentDataProvide,
  monthTableData
);

provide<AppDateTimePickerYearTableComponentData>(
  AppDateTimePickerYearTableComponentDataProvide,
  yearTableData
);
</script>

<style lang="scss" scoped>
.ui-date-time-range-mode {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: var(--vpick--table-range-gap);
}
</style>
