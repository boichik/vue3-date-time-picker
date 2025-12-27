<template>
  <section class="app-time-picker-controller">
    <AppTimeBar
      v-if="showComponent.hours"
      v-model="hoursModel"
      :disabled-value="isHourDisabled"
      :enabled-am-pm="showComponent.amPm"
    />
    <template v-if="showComponent.minutes">
      <div
        v-if="showComponent.hours"
        class="app-time-picker-controller__separator"
      >
        {{ separator }}
      </div>
      <AppTimeBar
        v-model="minutesModel"
        :disabled-value="isMinuteDisabled"
        :type="typePickerBarType.Minutes"
      />
    </template>
    <template v-if="showComponent.seconds">
      <div
        v-if="showComponent.hours || showComponent.minutes"
        class="app-time-picker-controller__separator"
      >
        {{ separator }}
      </div>
      <AppTimeBar
        v-model="secondsModel"
        :disabled-value="isSecondDisabled"
        :type="typePickerBarType.Seconds"
      />
    </template>
    <template v-if="showComponent.amPm">
      <AppTimeBar
        v-model="amPmModel"
        :disabled-value="isAmPmDisabled"
        :type="typePickerBarType.AmPm"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type { AppTimePickerComponentData } from '../../interfaces/index.interface';
import { computed, inject, ref, watch } from 'vue';
import AppTimeBar from '../panel/AppTimeBar.vue';
import { isAfter, isBefore, setHours, setMinutes, setSeconds } from 'date-fns';
import { AppTimeBarType } from '../../enums/timeBarType';
import { isDate } from '@/utils/isDate';
import {
  parseSelectableRange,
  leadToValidDateRelativeToRange,
  getEnabledTimeTypes,
} from '../../utils/index';
import { isSameDateOrNullValue } from '@/utils/isSameDateOrNullValue';
import { getDateWithZeroMilliseconds, getNewDate } from '@/utils/getNewDate';
import { AppTimePickerComponentDataProvide } from '../../const';

const emit = defineEmits(['update:model-value']);

const { modelValue, selectableRange } = defineProps<{
  modelValue: null | Date;
  selectableRange?: string;
}>();

const typePickerBarType = AppTimeBarType;
const separator = ':';

const appTimePickerComponentData =
  inject<ComputedRef<AppTimePickerComponentData> | null>(
    AppTimePickerComponentDataProvide,
    null
  );

const selectedDate = ref<Date | null>(modelValue);

const dateForCreate = computed(() => {
  return selectedDate.value || modelValue || getNewDate();
});

const range = computed(() =>
  parseSelectableRange(selectableRange, dateForCreate.value)
);

watch(
  () => modelValue,
  value => {
    if (isSameDateOrNullValue(value, selectedDate.value)) {
      return;
    }

    let newValue = value || null;

    if (value && isDate(value)) {
      newValue = leadToValidDateRelativeToRange(value, range.value);
    }
    selectedDate.value = newValue;
  }
);

const hoursModel = computed({
  get() {
    const hours = selectedDate.value ? selectedDate.value.getHours() : 0;

    if (showComponent.value.amPm) {
      return hours % 12 === 0 ? 12 : hours % 12;
    }

    return hours;
  },
  set(value: number) {
    let newValue = value;
    if (showComponent.value.amPm) {
      const isPm = amPmModel.value === 1;
      if (isPm && newValue < 12) {
        newValue = newValue + 12;
      } else if (!isPm && newValue === 12) {
        newValue = 0;
      }
    }

    const date = leadToValidDateRelativeToRange(
      setHours(selectedDate.value as Date, newValue),
      range.value
    );

    emit('update:model-value', date);
  },
});

const minutesModel = computed({
  get() {
    return selectedDate.value ? selectedDate.value.getMinutes() : 0;
  },
  set(value: number) {
    const date = leadToValidDateRelativeToRange(
      setMinutes(selectedDate.value as Date, value),
      range.value
    );

    emit('update:model-value', date);
  },
});

const secondsModel = computed({
  get() {
    return selectedDate.value ? selectedDate.value.getSeconds() : 0;
  },
  set(value: number) {
    const date = leadToValidDateRelativeToRange(
      setSeconds(selectedDate.value as Date, value),
      range.value
    );

    emit('update:model-value', date);
  },
});

const amPmModel = computed({
  get() {
    const value = selectedDate.value ? selectedDate.value.getHours() : 0;

    return value >= 12 ? 1 : 0;
  },
  set(value: number) {
    const hours = dateForCreate.value.getHours();
    let newValue = hours;
    if (value === 1 && hours < 12) {
      newValue = hours + 12;
    } else if (value === 0 && hours >= 12) {
      newValue = hours - 12;
    }

    const date = leadToValidDateRelativeToRange(
      setHours(selectedDate.value as Date, newValue),
      range.value
    );
    emit('update:model-value', date);
  },
});

const showComponent = computed(() => {
  return getEnabledTimeTypes(appTimePickerComponentData?.value.format || '');
});

const isRange = computed(() => {
  return appTimePickerComponentData?.value.isRange;
});

function convertTo24HourFormat(hour: number): number {
  if (showComponent.value.amPm) {
    return amPmModel.value === 1 ? (hour % 12) + 12 : hour % 12;
  }
  return hour;
}

function checkIsDisabledDate(value: Date) {
  if (!isRange.value && appTimePickerComponentData?.value.isDisabledDate) {
    return appTimePickerComponentData.value.isDisabledDate(value);
  }

  const { startTime, endTime } = range.value;

  if (!startTime || !endTime) {
    return false;
  }

  return (
    isBefore(getDateWithZeroMilliseconds(value), startTime) ||
    isAfter(getDateWithZeroMilliseconds(value), endTime)
  );
}

function isHourDisabled(hour: number) {
  const hour24 = convertTo24HourFormat(hour);
  return checkIsDisabledDate(setHours(dateForCreate.value, hour24));
}

function isMinuteDisabled(minute: number) {
  const currentHour = convertTo24HourFormat(hoursModel.value);

  const minuteDate = setMinutes(
    setHours(dateForCreate.value, currentHour),
    minute
  );

  return checkIsDisabledDate(minuteDate);
}

function isSecondDisabled(second: number) {
  const currentHour = convertTo24HourFormat(hoursModel.value);
  const currentMinute = minutesModel.value;

  const secondDate = setSeconds(
    setMinutes(setHours(dateForCreate.value, currentHour), currentMinute),
    second
  );

  return checkIsDisabledDate(secondDate);
}

function isAmPmDisabled(value: number): boolean {
  const currentHour = hoursModel.value;
  const isPm = value === 1;

  let newHour: number;

  if (isPm) {
    newHour = currentHour < 12 ? currentHour + 12 : currentHour;
  } else {
    newHour = currentHour >= 12 ? currentHour - 12 : currentHour;
  }

  const dateWithNewHour = setHours(dateForCreate.value, newHour);
  return checkIsDisabledDate(dateWithNewHour);
}
</script>
<style lang="scss" scoped>
.app-time-picker-controller {
  display: flex;
  justify-content: center;
  align-items: center;

  &__separator {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--vpick--time-bar-separator-width);
    padding: calc(
        var(--vpick--time-bar-item-padding-height) - var(
            --vpick--time-bar-list-select-section-border-width
          )
      )
      0;
    font-family: var(--vpick--font-family);
    font-size: var(--vpick--time-bar-item-font-size);
    font-weight: var(--vpick--time-bar-item-font-weight);
    color: var(--vpick--time-bar-item-color);
    user-select: none;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 3px;
      height: calc(
        100% - var(--vpick--time-bar-list-select-section-border-width) - 5px
      );
      width: var(--vpick--time-bar-separator-width);
      border-top: var(--vpick--time-bar-list-select-section-border-width)
        var(--vpick--time-bar-list-select-section-border-style)
        var(--vpick--time-bar-list-select-section-border-color);
      border-bottom: var(--vpick--time-bar-list-select-section-border-width)
        var(--vpick--time-bar-list-select-section-border-style)
        var(--vpick--time-bar-list-select-section-border-color);
    }
  }
}
</style>
