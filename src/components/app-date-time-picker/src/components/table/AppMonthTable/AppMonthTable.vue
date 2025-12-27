<template>
  <div class="app-date-time-picker-month">
    <table class="app-date-time-picker-month-table">
      <tbody>
        <tr v-for="(row, index) in monthRows" :key="index">
          <td
            v-for="(month, monthIndex) in row"
            :key="monthIndex"
            :class="calendarCellClasses(month.date)"
            @click="selectMonth(month.date)"
            @mouseenter="hoverDate(month.date)"
            @mouseleave="resetHover"
          >
            <div class="app-date-time-picker-month-table__cell-content">
              {{ month.name }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import { computed, inject } from 'vue';
import { isSameMonth, setMonth, setYear } from 'date-fns';
import { isDisabledMonth } from '../../../utils';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
  AppDateTimePickerMonthTableComponentDataProvide,
} from '../../../const';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerGlobalTableComponentData,
  AppDateTimePickerMonthTableComponentData,
} from '../../../interfaces/index.interface';
import { getNewDate } from '@/utils/getNewDate';
import { AppDateTimePickerMode } from '../../../enums/dateTimePickerMode';

const emit = defineEmits(['update']);

const { value = undefined, currentDate = new Date() } = defineProps<{
  value?: Date | null;
  currentDate: Date;
}>();

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const appDateTimePickerMonthTableComponentData =
  inject<AppDateTimePickerMonthTableComponentData | null>(
    AppDateTimePickerMonthTableComponentDataProvide,
    null
  );

const appDateTimePickerGlobalTableComponentData =
  inject<AppDateTimePickerGlobalTableComponentData | null>(
    AppDateTimePickerGlobalTableComponentDataProvide,
    null
  );

const monthRows = computed(() => {
  const { locale, monthCellFormat } =
    appDateTimePickerComponentData?.value || {};

  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(currentDate.getFullYear(), index, 1);

    return {
      index,
      date,
      name: Intl.DateTimeFormat(locale, { month: monthCellFormat }).format(
        date
      ),
    };
  });

  const rows = [];
  for (let i = 0; i < months.length; i += 4) {
    rows.push(months.slice(i, i + 4));
  }
  return rows;
});

const today = computed(
  () => appDateTimePickerComponentData?.value?.today || getNewDate()
);

function calendarCellClasses(date: Date) {
  const selectedValue = isSelected(date);
  const classes = ['app-date-time-picker-month-table__cell'];

  if (isInRange(date)) {
    classes.push('app-date-time-picker-month-table__cell--in-range');
  }

  if (isHoverRange(date)) {
    classes.push('app-date-time-picker-month-table__cell--hover-range');
  }

  if (isDisabled(date)) {
    classes.push('app-date-time-picker-month-table__cell--disabled');
  }

  if (isCurrentMonth(date)) {
    classes.push('app-date-time-picker-month-table__cell--current-month');
  }

  if (selectedValue) {
    classes.push(
      ...[
        'app-date-time-picker-month-table__cell--selected-month',
        `app-date-time-picker-month-table__cell--selected-month--${selectedValue}`,
      ]
    );
  }

  return classes;
}

function isCurrentMonth(date: Date) {
  return isSameMonth(today.value, date);
}

function isDisabled(date: Date) {
  const fn = appDateTimePickerComponentData?.value?.disabledDate;
  return isDisabledMonth(date, fn);
}

function isSelected(date: Date) {
  if (
    appDateTimePickerMonthTableComponentData &&
    appDateTimePickerMonthTableComponentData.isSelected
  ) {
    return appDateTimePickerMonthTableComponentData.isSelected(date);
  }

  if (!value) {
    return false;
  }

  return isSameMonth(date, value);
}

function isInRange(date: Date) {
  if (
    appDateTimePickerMonthTableComponentData &&
    appDateTimePickerMonthTableComponentData.inRange
  ) {
    return appDateTimePickerMonthTableComponentData.inRange(date);
  }

  return false;
}

function isHoverRange(date: Date) {
  if (
    appDateTimePickerMonthTableComponentData &&
    appDateTimePickerMonthTableComponentData.isHoverRange
  ) {
    return appDateTimePickerMonthTableComponentData.isHoverRange(date);
  }

  return false;
}

function hoverDate(date: Date) {
  if (
    appDateTimePickerMonthTableComponentData &&
    appDateTimePickerMonthTableComponentData.hover
  ) {
    return appDateTimePickerMonthTableComponentData.hover(date);
  }
}

function resetHover() {
  if (
    appDateTimePickerMonthTableComponentData &&
    appDateTimePickerMonthTableComponentData.resetHover
  ) {
    return appDateTimePickerMonthTableComponentData.resetHover();
  }
}

function selectMonth(date: Date) {
  if (isDisabled(date)) return;
  const oldDate = value || currentDate;

  const newMonth = date.getMonth();
  const newYear = date.getFullYear();

  const newValue = setYear(setMonth(oldDate, newMonth), newYear);

  if (
    appDateTimePickerComponentData?.value.mode !== AppDateTimePickerMode.Day
  ) {
    if (
      appDateTimePickerGlobalTableComponentData &&
      Boolean(appDateTimePickerGlobalTableComponentData.select) &&
      typeof appDateTimePickerGlobalTableComponentData.select === 'function'
    ) {
      appDateTimePickerGlobalTableComponentData.select(newValue);
    }

    if (
      appDateTimePickerMonthTableComponentData &&
      Boolean(appDateTimePickerMonthTableComponentData.select) &&
      typeof appDateTimePickerMonthTableComponentData.select === 'function'
    ) {
      appDateTimePickerMonthTableComponentData!.select(newValue);
    }
  }

  emit('update', newValue);
}
</script>

<style lang="scss" scoped>
.app-date-time-picker-month {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 1px;

  &-table {
    border-spacing: var(--vpick--table-cell-gap);
    border-collapse: separate;

    th,
    td {
      text-align: center;
      color: unset;
      background-color: unset;
      border: unset;
      padding: unset;
    }

    &__cell {
      user-select: none;

      @media (hover: hover) {
        cursor: pointer;

        &:hover:not(.app-date-time-picker-month-table__cell--disabled):not(
            .app-date-time-picker-month-table__cell--selected-month
          ):not(.app-date-time-picker-month-table__cell--in-range) {
          .app-date-time-picker-month-table__cell-content {
            color: var(--vpick--table-cell-hover-color);
            background-color: var(--vpick--table-cell-hover-bg-color);
            border-color: var(--vpick--table-cell-hover-border-color);
          }
        }
      }

      &--disabled {
        cursor: not-allowed;

        .app-date-time-picker-month-table__cell-content {
          color: var(--vpick--table-cell-disabled-color);
          background-color: var(--vpick--table-cell-disabled-bg-color);
          border-color: var(--vpick--table-cell-disabled-border-color);
        }
      }

      &--current-month {
        .app-date-time-picker-month-table__cell-content {
          position: relative;

          &::before {
            content: '';
            position: absolute;
            border-radius: 50%;
            width: var(--vpick--table-cell-today-size);
            height: var(--vpick--table-cell-today-size);
            left: var(--vpick--month-table-cell-today-left);
            bottom: var(--vpick--table-cell-today-bottom);
            background-color: var(--vpick--table-cell-today-color);
          }
        }
      }

      &--selected-month {
        &.app-date-time-picker-month-table__cell--selected-month--left {
          border-radius: var(--vpick--table-cell-border-radius) 0 0
            var(--vpick--table-cell-border-radius);
        }

        &.app-date-time-picker-month-table__cell--selected-month--right {
          border-radius: 0 var(--vpick--table-cell-border-radius)
            var(--vpick--table-cell-border-radius) 0;
        }

        &.app-date-time-picker-month-table__cell--selected-month--center {
          border-radius: var(--vpick--table-cell-border-radius);
        }

        .app-date-time-picker-month-table__cell-content {
          color: var(--vpick--table-cell-selected-color);
          background-color: var(--vpick--table-cell-selected-bg-color);
          border-color: var(--vpick--table-cell-selected-border-color);

          &::before {
            background-color: var(--vpick--table-cell-today-selected-color);
          }
        }
      }

      &--in-range:not(.app-date-time-picker-month-table__cell--selected-month) {
        .app-date-time-picker-month-table__cell-content {
          color: var(--vpick--table-cell-range-color);
          background-color: var(--vpick--table-cell-range-bg-color);
          border-color: var(--vpick--table-cell-range-border-color);
        }
      }

      &--hover-range:not(
          .app-date-time-picker-month-table__cell--selected-month
        ) {
        .app-date-time-picker-month-table__cell-content {
          color: var(--vpick--table-cell-range-hover-color);
          background-color: var(--vpick--table-cell-range-hover-bg-color);
          border-color: var(--vpick--table-cell-range-hover-border-color);
        }
      }

      &-content {
        display: flex;
        justify-content: center;
        align-items: center;
        font: var(--vpick--table-cell-font);
        border: var(--vpick--table-cell-border);
        width: var(--vpick--month-table-cell-size);
        height: var(--vpick--month-table-cell-size);
        color: var(--vpick--table-cell-color);
        border-radius: var(--vpick--table-cell-border-radius);
        border-color: var(--vpick--table-cell-border-color);
        background-color: var(--vpick--table-cell-bg-color);
        text-transform: var(--vpick--month-table-cell-text-transform);
      }
    }
  }
}
</style>
