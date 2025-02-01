<template>
  <div class="app-date-time-picker-month">
    <table class="app-date-time-picker-month-table">
      <tbody>
        <tr v-for="(row, index) in monthRows" :key="index">
          <td
            v-for="(month, monthIndex) in row"
            :key="monthIndex"
            :class="{
              'app-date-time-picker-month-table__cell--current-month':
                isCurrentMonth(month.date),
              'app-date-time-picker-month-table__cell--selected-month':
                isSelectedMonth(month.date),
              'app-date-time-picker-month-table__cell--disabled': isDisabled(
                month.date
              ),
            }"
            class="app-date-time-picker-month-table__cell"
            @click="selectMonth(month.date)"
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
import { isDisabledMonth } from '../../utils';
import { AppDateTimePickerComponentDataProvide } from '../../const';
import type { AppDateTimePickerComponentData } from '../../interfaces';
import { getNewDate } from '@/utils/getNewDate';

const emit = defineEmits(['update']);

const props = withDefaults(
  defineProps<{ value?: Date | null; currentDate: Date }>(),
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

const monthRows = computed(() => {
  const { locale, monthCellFormat } =
    appDateTimePickerComponentData?.value || {};

  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(props.currentDate.getFullYear(), index, 1);

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

function isCurrentMonth(date: Date) {
  return isSameMonth(today.value, date);
}

function isDisabled(date: Date) {
  const fn = appDateTimePickerComponentData?.value?.disabledDate;
  return isDisabledMonth(date, fn);
}

function isSelectedMonth(date: Date) {
  if (!props.value) {
    return false;
  }

  return isSameMonth(date, props.value);
}

function selectMonth(date: Date) {
  if (isDisabled(date)) {
    return;
  }

  const oldDate = props.value || props.currentDate;

  const newMonth = date.getMonth();
  const newYear = date.getFullYear();

  emit('update', setYear(setMonth(oldDate, newMonth), newYear));
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
          ) {
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
        .app-date-time-picker-month-table__cell-content {
          color: var(--vpick--table-cell-selected-color);
          background-color: var(--vpick--table-cell-selected-bg-color);
          border-color: var(--vpick--table-cell-selected-border-color);

          &::before {
            background-color: var(--vpick--table-cell-today-selected-color);
          }
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
