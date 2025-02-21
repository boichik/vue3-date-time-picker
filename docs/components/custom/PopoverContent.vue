<template>
  <div class="popover-content">
    <AppDateTimeContent />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { AppDateTimePickerComponentDataProvide } from '../../../src/components/app-date-time-picker/src/const';

const { isUkLocale = false } = defineProps<{ isUkLocale?: boolean }>();

const DEFAULT_WEEDDAY_FORMAT = 'short';
const DEFAULT_MONTH_CELL_FORMAT = 'short';
const DEFAULT_MONTH_BUTTON_FORMAT = 'long';

const provideDate = computed(() => {
  return {
    shortcuts: [],
    weekdayFormat: DEFAULT_WEEDDAY_FORMAT,
    monthCellFormat: DEFAULT_MONTH_CELL_FORMAT,
    monthButtonFormat: DEFAULT_MONTH_BUTTON_FORMAT,
    mode: 'day',
    ...(isUkLocale
      ? {
          locale: 'uk',
          cancelText: 'Скасувати',
          applyText: 'Застосувати',
        }
      : {}),
  };
});

provide(AppDateTimePickerComponentDataProvide, provideDate);
</script>

<style lang="scss" scoped>
.popover-content {
  width: fit-content;
  background-color: var(--vpick--popover-bg-color);
  padding: var(--vpick--popover-padding);
  border: var(--vpick--popover-border);
  border-radius: var(--vpick--popover-border-radius);
  box-shadow: var(--vpick--popover-box-shadow);

  *,
  ::before,
  ::after {
    box-sizing: content-box;
  }
}
</style>
