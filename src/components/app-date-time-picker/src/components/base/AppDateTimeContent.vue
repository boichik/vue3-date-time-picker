<template>
  <div class="app-date-time-picker-content" :class="contentClass">
    <AppDateTimeShortcutPanel
      v-if="isAvailableShortcutsList"
      ref="shortcuts"
      :style="shortcutsStyle"
      class="app-date-time-picker-content__shortcuts"
      @select="handleSelectValue"
    />
    <div ref="picker" class="app-date-time-picker-content__picker">
      <component :is="currentComponent" v-model="model" />
    </div>

    <AppButtonPanel
      :disabled="appButtonData.disabledApplyButton"
      :cancel-text="appButtonData.cancelText"
      :apply-text="appButtonData.applyText"
      class="app-date-time-picker-content__panel"
      @apply="() => appButtonData.applyChange && appButtonData.applyChange()"
      @cancel="() => appButtonData.cancelChange && appButtonData.cancelChange()"
    />
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import { inject, computed, ref, onMounted, onBeforeUnmount } from 'vue';
import type {
  AppDateTimePickerComponentData,
  AppDateTimePickerModel,
} from '../../interfaces';
import AppButtonPanel from '@/ui/AppButtonPanel.vue';
import AppDateTimeShortcutPanel from '../panel/AppDateTimeShortcutPanel.vue';
import AppDateMode from '../mode/AppDateMode.vue';
import AppDateRangeMode from '../mode/AppDateRangeMode.vue';
import AppDateTimeMode from '../mode/AppDateTimeMode.vue';
import AppDateTimeRangeMode from '../mode/AppDateTimeRangeMode.vue';
import { AppDateTimePickerComponentDataProvide } from '../../const';

const picker = ref<HTMLElement | null>(null);
const shortcuts = ref<HTMLElement | null>(null);

const model = defineModel<AppDateTimePickerModel>({ default: null });

const shortcutsMaxHeight = ref(0);
let resizeObserver: ResizeObserver | null = null;

const shortcutsStyle = computed(() => {
  return {
    maxHeight: `${shortcutsMaxHeight.value}px`,
  };
});

const appDateTimePickerComponentData =
  inject<ComputedRef<AppDateTimePickerComponentData> | null>(
    AppDateTimePickerComponentDataProvide,
    null
  );

const appButtonData = computed(() => {
  const {
    cancelText,
    applyText,
    disabledApplyButton,
    applyChange,
    cancelChange,
  } = appDateTimePickerComponentData?.value || {};

  return {
    cancelText,
    applyText,
    disabledApplyButton,
    applyChange,
    cancelChange,
  };
});

const isAvailableShortcutsList = computed(
  () => !!appDateTimePickerComponentData?.value.shortcuts?.length
);

const contentClass = computed(() => {
  return {
    'app-date-time-picker-content--with-shortcuts':
      isAvailableShortcutsList.value,
  };
});

const currentComponent = computed(() => {
  switch (appDateTimePickerComponentData?.value.type) {
    case 'date':
      return AppDateMode;
    case 'daterange':
      return AppDateRangeMode;
    case 'datetime':
      return AppDateTimeMode;
    case 'datetimerange':
      return AppDateTimeRangeMode;
    default:
      return AppDateMode;
  }
});

function handleSelectValue(value: AppDateTimePickerModel) {
  model.value = value;
}

function updateShortcutsMaxHeight() {
  if (picker.value && shortcuts.value) {
    const componentHeight = picker.value.offsetHeight;
    shortcutsMaxHeight.value = componentHeight;
  }
}

onMounted(() => {
  if (picker.value instanceof Element) {
    resizeObserver = new ResizeObserver(updateShortcutsMaxHeight);
    resizeObserver.observe(picker.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<style lang="scss" scoped>
.app-date-time-picker-content {
  display: grid;
  grid-template-columns: auto;

  &--with-shortcuts {
    grid-template-columns: var(--vpick--shortcut-list-width) auto;
    column-gap: var(--vpick--date-time-content-column-gap);
  }

  &__picker {
    padding-bottom: var(--vpick--date-time-content-padding-bottom);
    height: max-content;
  }

  &__panel {
    grid-column: 1 / 3;
    grid-column-start: 1;
  }

  &__shortcuts {
    background-color: var(--vpick--shortcut-list-bg-color);
    border-right: var(--vpick--shortcut-list-border-right);
    padding: var(--vpick--shortcut-list-padding);
  }
}
</style>
