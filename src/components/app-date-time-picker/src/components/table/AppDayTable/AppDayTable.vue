<template>
  <table class="app-date-time-picker-day-table">
    <thead class="app-date-time-picker-day-table__weekdays">
      <tr>
        <th
          v-for="day in reorderedDaysOfWeek"
          :key="day"
          class="app-date-time-picker-day-table__cell"
        >
          <div class="app-date-time-picker-day-table__cell-content">
            {{ day }}
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(week, index) in weeks" :key="index">
        <td
          v-for="day in week"
          :key="+day.date"
          :class="calendarCellClasses(day.date, day.isOtherMonth)"
          class="app-date-time-picker-day-table__cell"
          @click="selectDate(day.date, day.isOtherMonth)"
          @mouseenter="hoverDate(day.date, day.isOtherMonth)"
          @mouseleave="resetHover(day.isOtherMonth)"
        >
          <div class="app-date-time-picker-day-table__cell-content">
            {{ day.day }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerDayTableComponentData,
  AppDateTimePickerGlobalTableComponentData,
} from '../../../interfaces/index.interface';
import { computed, inject } from 'vue';
import {
  startOfMonth,
  endOfMonth,
  getDay,
  subDays,
  eachDayOfInterval,
  addDays,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { getDayStart, getDayEnd, getNewDate } from '@/utils/getNewDate';
import {
  AppDateTimePickerComponentDataProvide,
  AppDateTimePickerDayTableComponentDataProvide,
  AppDateTimePickerGlobalTableComponentDataProvide,
} from '../../../const';
const { value = undefined, currentDate = new Date() } = defineProps<{
  value?: Date | null;
  currentDate: Date;
}>();

const appDateTimePickerDayTableComponentData =
  inject<AppDateTimePickerDayTableComponentData | null>(
    AppDateTimePickerDayTableComponentDataProvide,
    null
  );

const appDateTimePickerGlobalTableComponentData =
  inject<AppDateTimePickerGlobalTableComponentData | null>(
    AppDateTimePickerGlobalTableComponentDataProvide,
    null
  );

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const hideOffsetDay = computed(
  () => appDateTimePickerComponentData?.value.hideOffsetDay
);

const firstDayOfWeek = computed(() => {
  return appDateTimePickerComponentData?.value?.firstDayOfWeek || 1;
});

const daysOfWeek = computed(() => {
  const { locale, weekdayFormat } = appDateTimePickerComponentData?.value || {};
  return new Array(7).fill('', 0, 7).map((_, index) => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const date = addDays(monday, index);

    return Intl.DateTimeFormat(locale, {
      weekday: weekdayFormat,
    }).format(date);
  });
});

const reorderedDaysOfWeek = computed(() => {
  const offset = firstDayOfWeek.value - 1;
  return [
    ...daysOfWeek.value.slice(offset),
    ...daysOfWeek.value.slice(0, offset),
  ];
});

const calendarDays = computed(() => generateCalendarDays(currentDate));

const weeks = computed(() => {
  const grouped = [];
  for (let i = 0; i < calendarDays.value.length; i += 7) {
    grouped.push(calendarDays.value.slice(i, i + 7));
  }
  return grouped;
});

const today = computed(
  () => appDateTimePickerComponentData?.value?.today || getNewDate()
);

function generateCalendarDays(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const firstDayOfWeekIndex = firstDayOfWeek.value % 7;
  const startDay = (getDay(start) - firstDayOfWeekIndex + 7) % 7;

  const prevDays = Array.from({ length: startDay }).map((_, i) => {
    const prevDate = subDays(start, startDay - i);
    return {
      day: prevDate.getDate(),
      date: prevDate,
      isOtherMonth: true,
    };
  });

  const days = eachDayOfInterval({ start, end }).map(date => ({
    day: date.getDate(),
    date: date,
    isOtherMonth: false,
  }));

  const remainingDays = 42 - (prevDays.length + days.length);
  const nextDays = Array.from({ length: remainingDays }).map((_, i) => {
    const nextDate = addDays(end, i + 1);
    return {
      day: nextDate.getDate(),
      date: nextDate,
      isOtherMonth: true,
    };
  });

  return [...prevDays, ...days, ...nextDays];
}

function calendarCellClasses(date: Date, isOtherMonth: boolean) {
  const selectedValue = isSelected(date, isOtherMonth);
  const classes = [];

  if (isInRange(date, isOtherMonth)) {
    classes.push('app-date-time-picker-day-table__cell--in-range');
  }

  if (isHoverRange(date, isOtherMonth)) {
    classes.push('app-date-time-picker-day-table__cell--hover-range');
  }

  if (isDisabled(date)) {
    classes.push('app-date-time-picker-day-table__cell--disabled');
  }

  if (isOtherMonth) {
    classes.push('app-date-time-picker-day-table__cell--other-month');
  }

  if (isOtherMonth && hideOffsetDay.value) {
    classes.push('app-date-time-picker-day-table__cell--hide');
  }

  if (isToday(date)) {
    classes.push('app-date-time-picker-day-table__cell--current-day');
  }

  if (selectedValue) {
    classes.push(
      ...[
        'app-date-time-picker-day-table__cell--selected',
        `app-date-time-picker-day-table__cell--selected-${selectedValue}`,
      ]
    );
  }

  return classes;
}

function isToday(date: Date) {
  return getDayStart(today.value) <= +date && +date < +getDayEnd(today.value);
}

function isDisabled(date: Date) {
  const fn = appDateTimePickerComponentData?.value?.disabledDate;

  if (fn) {
    return fn(date);
  }

  return false;
}

function isSelected(date: Date, isOtherMonth: boolean) {
  if (isOtherMonth && hideOffsetDay.value) return;

  if (
    appDateTimePickerDayTableComponentData &&
    appDateTimePickerDayTableComponentData.isSelected
  ) {
    return appDateTimePickerDayTableComponentData.isSelected(
      date,
      isOtherMonth
    );
  }
  if (value && isSameDay(value, date)) return 'center';

  return null;
}

function isInRange(date: Date, isOtherMonth: boolean) {
  if (isOtherMonth && hideOffsetDay.value) return;

  if (
    appDateTimePickerDayTableComponentData &&
    appDateTimePickerDayTableComponentData.inRange
  ) {
    return appDateTimePickerDayTableComponentData.inRange(date, isOtherMonth);
  }

  return false;
}

function isHoverRange(date: Date, isOtherMonth: boolean) {
  if (isOtherMonth && hideOffsetDay.value) return;

  if (
    appDateTimePickerDayTableComponentData &&
    appDateTimePickerDayTableComponentData.isHoverRange
  ) {
    return appDateTimePickerDayTableComponentData.isHoverRange(
      date,
      isOtherMonth
    );
  }

  return false;
}

function hoverDate(date: Date, isOtherMonth: boolean) {
  if (isOtherMonth && hideOffsetDay.value) return;

  if (
    appDateTimePickerDayTableComponentData &&
    appDateTimePickerDayTableComponentData.hover
  ) {
    appDateTimePickerDayTableComponentData.hover(date);
  }
}

function resetHover(isOtherMonth: boolean) {
  if (isOtherMonth && hideOffsetDay.value) return;

  if (
    appDateTimePickerDayTableComponentData &&
    appDateTimePickerDayTableComponentData.resetHover
  ) {
    appDateTimePickerDayTableComponentData.resetHover();
  }
}

function selectDate(date: Date, isOtherMonth: boolean) {
  if (isDisabled(date) || (isOtherMonth && hideOffsetDay.value)) return;

  if (
    appDateTimePickerGlobalTableComponentData &&
    appDateTimePickerGlobalTableComponentData.select
  ) {
    appDateTimePickerGlobalTableComponentData.select(date);
  }

  if (
    appDateTimePickerDayTableComponentData &&
    appDateTimePickerDayTableComponentData.select
  ) {
    appDateTimePickerDayTableComponentData.select(date);
  }
}
</script>

<style lang="scss" scoped>
.app-date-time-picker-day-table {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

  &__weekdays {
    margin-bottom: var(--vpick--day-table-weekdays-margin-bottom);

    .app-date-time-picker-day-table__cell {
      cursor: default;

      @media (hover: hover) {
        &:hover .app-date-time-picker-day-table__cell-content {
          background-color: var(
            --vpick--day-table-weekdays-bg-color
          ) !important;
          color: var(--vpick--day-table-weekdays-color) !important;
          border-color: transparent !important;
        }
      }

      &-content {
        background-color: var(--vpick--day-table-weekdays-bg-color);
        color: var(--vpick--day-table-weekdays-color);
        border-color: transparent !important;
        text-transform: var(--vpick--day-table-weekdays-text-transform);
      }
    }
  }

  &__cell {
    user-select: none;

    @media (hover: hover) {
      cursor: pointer;

      &:hover:not(.app-date-time-picker-day-table__cell--disabled):not(
          .app-date-time-picker-day-table__cell--selected
        ):not(.app-date-time-picker-day-table__cell--in-range):not(
          .app-date-time-picker-day-table__cell--other-month
        ) {
        .app-date-time-picker-day-table__cell-content {
          color: var(--vpick--table-cell-hover-color);
          background-color: var(--vpick--table-cell-hover-bg-color);
          border-color: var(--vpick--table-cell-hover-border-color);
        }
      }
    }

    &--disabled {
      cursor: not-allowed;

      .app-date-time-picker-day-table__cell-content {
        color: var(--vpick--table-cell-disabled-color);
        background-color: var(--vpick--table-cell-disabled-bg-color);
        border-color: var(--vpick--table-cell-disabled-border-color);
      }
    }

    &--selected:not(.app-date-time-picker-day-table__cell--other-month) {
      &.app-date-time-picker-day-table__cell--selected-left {
        border-radius: var(--vpick--table-cell-border-radius) 0 0
          var(--vpick--table-cell-border-radius);
      }

      &.app-date-time-picker-day-table__cell--selected-right {
        border-radius: 0 var(--vpick--table-cell-border-radius)
          var(--vpick--table-cell-border-radius) 0;
      }

      &.app-date-time-picker-day-table__cell--selected-center {
        border-radius: var(--vpick--table-cell-border-radius);
      }

      .app-date-time-picker-day-table__cell-content {
        color: var(--vpick--table-cell-selected-color);
        background-color: var(--vpick--table-cell-selected-bg-color);
        border-color: var(--vpick--table-cell-selected-border-color);

        &::before {
          background-color: var(
            --vpick--table-cell-today-selected-color
          ) !important;
        }
      }
    }

    &--in-range:not(.app-date-time-picker-day-table__cell--selected) {
      .app-date-time-picker-day-table__cell-content {
        color: var(--vpick--table-cell-range-color);
        background-color: var(--vpick--table-cell-range-bg-color);
        border-color: var(--vpick--table-cell-range-border-color);
      }
    }

    &--hover-range:not(.app-date-time-picker-day-table__cell--selected) {
      .app-date-time-picker-day-table__cell-content {
        color: var(--vpick--table-cell-range-hover-color);
        background-color: var(--vpick--table-cell-range-hover-bg-color);
        border-color: var(--vpick--table-cell-range-hover-border-color);
      }
    }

    &--other-month {
      .app-date-time-picker-day-table__cell-content {
        color: var(--vpick--day-table-cell-other-month-color);
        background-color: var(--vpick--day-table-cell-other-month-bg-color);
        border-color: var(--vpick--day-table-cell-other-month-border-color);
      }
    }

    &--hide {
      cursor: default;

      .app-date-time-picker-day-table__cell-content {
        opacity: 0;
        height: 0;
        border: unset;
      }
    }

    &--current-day:not(.app-date-time-picker-day-table__cell--other-month) {
      .app-date-time-picker-day-table__cell-content {
        position: relative;

        &::before {
          content: '';
          position: absolute;
          border-radius: 50%;
          width: var(--vpick--table-cell-today-size);
          height: var(--vpick--table-cell-today-size);
          left: var(--vpick--day-table-cell-today-left);
          bottom: var(--vpick--table-cell-today-bottom);
          background-color: var(--vpick--table-cell-today-color);
        }
      }
    }

    &-content {
      display: flex;
      justify-content: center;
      align-items: center;
      font: var(--vpick--table-cell-font);
      border: var(--vpick--table-cell-border);
      width: var(--vpick--day-table-cell-size);
      height: var(--vpick--day-table-cell-size);
      color: var(--vpick--table-cell-color);
      border-radius: var(--vpick--table-cell-border-radius);
      border-color: var(--vpick--table-cell-border-color);
      background-color: var(--vpick--table-cell-bg-color);
    }
  }
}
</style>
