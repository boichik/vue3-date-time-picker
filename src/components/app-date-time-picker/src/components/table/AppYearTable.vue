<template>
  <div class="app-date-time-picker-year">
    <table class="app-date-time-picker-year-table">
      <tbody>
        <tr v-for="(row, index) in yearRows" :key="index">
          <td
            v-for="(year, yearIndex) in row"
            :key="yearIndex"
            :class="{
              'app-date-time-picker-year-table__cell--current-year':
                isCurrentYear(year.date),
              'app-date-time-picker-year-table__cell--selected-year':
                isSelectedYear(year.date),
              'app-date-time-picker-year-table__cell--disabled': isDisabled(
                year.date
              ),
            }"
            class="app-date-time-picker-year-table__cell"
            @click="selectYear(year.date)"
          >
            <div class="app-date-time-picker-year-table__cell-content">
              {{ year.number }}
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
import { isSameYear, setYear } from 'date-fns';
import { isDisabledYear } from '../../utils';
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

const yearRows = computed(() => {
  const currentYear = props.currentDate.getFullYear();

  const startOfDecade = Math.floor(currentYear / 10) * 10;

  const decadeYears = Array.from({ length: 10 }, (_, i) => {
    return {
      number: startOfDecade + i,
      date: formattedDate(startOfDecade + i),
    };
  });

  const rows = [];
  for (let i = 0; i < decadeYears.length; i += 4) {
    rows.push(decadeYears.slice(i, i + 4));
  }

  return rows;
});

const today = computed(
  () => appDateTimePickerComponentData?.value?.today || getNewDate()
);

function isCurrentYear(date: Date) {
  return isSameYear(today.value, date);
}

function isSelectedYear(date: Date) {
  if (!props.value) {
    return false;
  }

  return isSameYear(date, props.value);
}

function isDisabled(date: Date) {
  const fn = appDateTimePickerComponentData?.value?.disabledDate;
  return isDisabledYear(date, fn);
}

function formattedDate(year: number) {
  const oldDate = props.value || props.currentDate;

  return setYear(oldDate, year);
}

function selectYear(date: Date) {
  if (isDisabled(date)) {
    return;
  }
  emit('update', date);
}
</script>

<style lang="scss" scoped>
.app-date-time-picker-year {
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

        &:hover:not(.app-date-time-picker-year-table__cell--disabled):not(
            .app-date-time-picker-year-table__cell--selected-year
          ) {
          .app-date-time-picker-year-table__cell-content {
            color: var(--vpick--table-cell-hover-color);
            background-color: var(--vpick--table-cell-hover-bg-color);
            border-color: var(--vpick--table-cell-hover-border-color);
          }
        }
      }

      &--disabled {
        cursor: not-allowed;

        .app-date-time-picker-year-table__cell-content {
          color: var(--vpick--table-cell-disabled-color);
          background-color: var(--vpick--table-cell-disabled-bg-color);
          border-color: var(--vpick--table-cell-disabled-border-color);
        }
      }

      &--current-year {
        .app-date-time-picker-year-table__cell-content {
          position: relative;

          &::before {
            content: '';
            position: absolute;
            border-radius: 50%;
            width: var(--vpick--table-cell-today-size);
            height: var(--vpick--table-cell-today-size);
            left: var(--vpick--year-table-cell-today-left);
            bottom: var(--vpick--table-cell-today-bottom);
            background-color: var(--vpick--table-cell-today-color);
          }
        }
      }

      &--selected-year {
        .app-date-time-picker-year-table__cell-content {
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
        width: var(--vpick--year-table-cell-size);
        height: var(--vpick--year-table-cell-size);
        color: var(--vpick--table-cell-color);
        border-radius: var(--vpick--table-cell-border-radius);
        border-color: var(--vpick--table-cell-border-color);
        background-color: var(--vpick--table-cell-bg-color);
      }
    }
  }
}
</style>
