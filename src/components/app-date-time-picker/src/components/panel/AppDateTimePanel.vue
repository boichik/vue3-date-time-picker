<template>
  <div class="app-date-time-picker-panel">
    <AppDateTimeControlButton
      :disabled="isDisabledButtonRelativeDate.prevYear"
      class="app-date-time-picker-panel__button app-date-time-picker-panel__button--prev-year"
      double-arrow
      @click="handlePrevYear"
    />
    <AppDateTimeControlButton
      v-show="showMonthElements"
      :disabled="isDisabledButtonRelativeDate.prevMonth"
      class="app-date-time-picker-panel__button app-date-time-picker-panel__button--prev-month"
      @click="handlePrevMonth"
    />
    <div class="app-date-time-picker-panel__date">
      <button
        :disabled="disabledYearAndMonthButton"
        class="app-date-time-picker-panel__date-button"
        @click="handleYearMode"
      >
        {{ yearButtonContent }}
      </button>
      <button
        v-show="showMonthElements"
        :disabled="disabledYearAndMonthButton"
        class="app-date-time-picker-panel__date-button app-date-time-picker-panel__date-button--month"
        @click="handleMonthMode"
      >
        {{ monthButtonContent }}
      </button>
    </div>
    <AppDateTimeControlButton
      v-show="showMonthElements"
      :disabled="isDisabledButtonRelativeDate.nextMonth"
      class="app-date-time-picker-panel__button app-date-time-picker-panel__button--next-month"
      is-right-position
      @click="handleNextMonth"
    />
    <AppDateTimeControlButton
      :disabled="isDisabledButtonRelativeDate.nextYear"
      class="app-date-time-picker-panel__button app-date-time-picker-panel__button--next-year"
      double-arrow
      is-right-position
      @click="handleNextYear"
    />
  </div>
</template>

<script setup lang="ts">
import AppDateTimeControlButton from '../base/AppDateTimeControlButton.vue';
import type { ComputedRef } from 'vue';
import { computed, inject } from 'vue';
import { isDisabledMonth, isDisabledYear } from '../../utils';
import { addMonths, addYears, subMonths, subYears } from 'date-fns';
import { AppDateTimePickerMode } from '../../enums/dateTimePickerMode';
import { AppDateTimePickerComponentDataProvide } from '../../const';
import type { AppDateTimePickerComponentData } from '../../interfaces';

const emit = defineEmits([
  'prevYear',
  'nextYear',
  'prevMonth',
  'nextMonth',
  'changeMode',
]);

const props = withDefaults(
  defineProps<{
    value?: Date | null;
    currentDate: Date;
    mode: AppDateTimePickerMode;
  }>(),
  {
    value: undefined,
    currentDate: () => new Date(),
  }
);

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const displacementNumber = computed(() => {
  if (AppDateTimePickerMode.Year === props.mode) {
    return 10;
  } else {
    return 1;
  }
});

const yearButtonContent = computed(() => {
  if (![AppDateTimePickerMode.Year].includes(props.mode as never)) {
    return props.currentDate.getFullYear();
  } else {
    const currentYear = props.currentDate.getFullYear();

    const startOfDecade = Math.floor(currentYear / 10) * 10;
    const endOfDecade = startOfDecade + 9;

    return `${startOfDecade}-${endOfDecade}`;
  }
});

const disabledYearAndMonthButton = computed(() => {
  return !![AppDateTimePickerMode.Year].includes(props.mode as never);
});

const monthButtonContent = computed(() => {
  const { locale, monthButtonFormat } =
    appDateTimePickerComponentData?.value || {};

  return Intl.DateTimeFormat(locale, { month: monthButtonFormat }).format(
    props.currentDate
  );
});

const showMonthElements = computed(() => {
  return [AppDateTimePickerMode.Day].includes(props.mode as never);
});

const isDisabledButtonRelativeDate = computed(() => {
  return {
    prevYear: isDisabled(
      subYears(props.currentDate, displacementNumber.value),
      true
    ),
    prevMonth: isDisabled(
      subMonths(props.currentDate, displacementNumber.value)
    ),
    nextYear: isDisabled(
      addYears(props.currentDate, displacementNumber.value),
      true
    ),
    nextMonth: isDisabled(
      addMonths(props.currentDate, displacementNumber.value)
    ),
  };
});

function isDisabled(date: Date, checkYear?: boolean) {
  const fn = appDateTimePickerComponentData?.value?.disabledDate;

  if (checkYear) {
    return isDisabledYear(date, fn);
  }

  return isDisabledMonth(date, fn);
}

function handleSelectByScroll(event: WheelEvent) {
  const isNext = event.deltaY > 0 ? true : false;

  let fn: (() => void) | null = null;

  if (AppDateTimePickerMode.Day === props.mode) {
    fn = isNext ? handleNextMonth : handlePrevMonth;
  } else {
    fn = isNext ? handleNextYear : handlePrevYear;
  }

  if (fn) {
    fn();
  }
}

function handlePrevYear() {
  if (!isDisabledButtonRelativeDate.value.prevYear) {
    emit('prevYear', displacementNumber.value);
  }
}
function handlePrevMonth() {
  if (!isDisabledButtonRelativeDate.value.prevMonth) {
    emit('prevMonth', displacementNumber.value);
  }
}
function handleNextYear() {
  if (!isDisabledButtonRelativeDate.value.nextYear) {
    emit('nextYear', displacementNumber.value);
  }
}
function handleNextMonth() {
  if (!isDisabledButtonRelativeDate.value.nextMonth) {
    emit('nextMonth', displacementNumber.value);
  }
}

function handleYearMode() {
  emit('changeMode', AppDateTimePickerMode.Year);
}

function handleMonthMode() {
  emit('changeMode', AppDateTimePickerMode.Month);
}

defineExpose({ handleSelectByScroll });
</script>

<style lang="scss" scoped>
.app-date-time-picker-panel {
  width: 100%;
  height: var(--vpick--panel-center-height);
  display: grid;
  grid-template-columns:
    var(--vpick--control-btn-size)
    var(--vpick--control-btn-size)
    var(--vpick--panel-center-control-minmax-width)
    var(--vpick--control-btn-size)
    var(--vpick--control-btn-size);
  grid-template-areas: 'prev-year prev-month date next-month next-year';
  align-items: center;
  margin-bottom: var(--vpick--panel-margin-bottom);

  &__date {
    grid-area: date;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--vpick--panel-center-control-gap);

    &-button {
      font: var(--vpick--panel-center-control-font);
      padding: unset;
      background: unset;
      outline: unset;
      border: unset;
      color: var(--vpick--panel-center-control-color);
      transition: color var(--vpick--animation-delay);

      &--month {
        text-transform: var(--vpick--panel-center-control-text-transform-month);
      }

      @media (hover: hover) {
        cursor: pointer;

        &:hover:enabled {
          color: var(--vpick--panel-center-control-hover-color);
        }
      }

      &:focus-visible.app-date-time-picker-panel {
        color: var(--vpick--panel-center-control-focus-color);
      }

      &:disabled {
        cursor: default;
        color: var(--vpick--panel-center-control-disabled-color);
      }
    }
  }

  &__button {
    &--prev-year {
      grid-area: prev-year;
    }

    &--prev-month {
      grid-area: prev-month;
    }

    &--next-month {
      grid-area: next-month;
    }

    &--next-year {
      grid-area: next-year;
    }
  }
}
</style>
