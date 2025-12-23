<template>
  <div class="app-date-time-shortcut-panel">
    <AppScrollbar>
      <ul class="app-date-time-shortcut-panel__list">
        <li
          v-for="(shortcut, index) in shortcuts"
          :key="index"
          class="app-date-time-shortcut-panel__list-item"
          @click="handleClick(shortcut.value)"
        >
          {{ shortcut.text }}
        </li>
      </ul>
    </AppScrollbar>
  </div>
</template>

<script setup lang="ts">
import AppScrollbar from '@/ui/AppScrollbar/Index.vue';
import { inject, computed } from 'vue';
import { AppDateTimePickerType } from '../../../enums/dateTimePickerType';
import { isValidModelValue } from '@/utils/isValidModelValue';
import { AppDateTimePickerComponentDataProvide } from '../../../const';
import type { ComputedRef } from 'vue';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerModel,
} from '../../../interfaces/index.interface';

const emit = defineEmits<{
  (e: 'select', value: AppDateTimePickerModel): void;
}>();

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const shortcuts = computed(() => {
  return appDateTimePickerComponentData?.value.shortcuts || [];
});

const isRangeType = computed(() =>
  [
    AppDateTimePickerType.DateRange,
    AppDateTimePickerType.DateTimeRange,
  ].includes(appDateTimePickerComponentData?.value.type as never)
);

function handleClick(value: unknown) {
  if (
    isValidModelValue(value, {
      onlyRange: isRangeType.value,
      onlySingle: !isRangeType.value,
    })
  ) {
    emit('select', value);
  }
}
</script>

<style lang="scss" scoped>
.app-date-time-shortcut-panel {
  &__list {
    padding: unset;
    list-style: none;

    &-item {
      font: var(--vpick--shortcut-list-item-font);
      padding: var(--vpick--shortcut-list-item-padding);
      color: var(--vpick--shortcut-list-item-color);
      background: var(--vpick--shortcut-list-item-bg-color);
      transition: var(--vpick--animation-delay);
      border: var(--vpick--shortcut-list-item-border);
      text-align: var(--vpick--shortcut-list-item-text-align);

      @media (hover: hover) {
        cursor: pointer;

        &:hover {
          background-color: var(--vpick--shortcut-list-item-hover-bg-color);
          color: var(--vpick--shortcut-list-item-hover-color);
          border: var(--vpick--shortcut-list-item-hover-border);
        }
      }
    }
  }
}
</style>
