<template>
  <div class="app-time-picker-content">
    <div ref="picker" class="app-time-picker-content__picker">
      <component :is="currentComponent" v-model="model" />
    </div>

    <AppButtonPanel
      :disabled="appButtonData.disabledApplyButton"
      :cancel-text="appButtonData.cancelText"
      :apply-text="appButtonData.applyText"
      class="app-time-picker-content__panel"
      @apply="() => appButtonData.applyChange && appButtonData.applyChange()"
      @cancel="() => appButtonData.cancelChange && appButtonData.cancelChange()"
    />
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type {
  AppTimePickerComponentData,
  AppTimePickerModel,
} from '../../interfaces/index';
import { inject, computed, ref } from 'vue';
import AppButtonPanel from '@/ui/AppButtonPanel.vue';
import AppTimeDefaultMode from '../mode/AppTimeDefaultMode.vue';
import AppTimeRangeMode from '../mode/AppTimeRangeMode.vue';
import { AppTimePickerComponentDataProvide } from '../../const';

const picker = ref<HTMLElement | null>(null);

const model = defineModel<AppTimePickerModel>();

const appTimePickerComponentData =
  inject<ComputedRef<AppTimePickerComponentData> | null>(
    AppTimePickerComponentDataProvide,
    null
  );

const appButtonData = computed(() => {
  const {
    cancelText,
    applyText,
    disabledApplyButton,
    applyChange,
    cancelChange,
  } = appTimePickerComponentData?.value || {};

  return {
    cancelText,
    applyText,
    disabledApplyButton,
    applyChange,
    cancelChange,
  };
});

const currentComponent = computed(() => {
  return appTimePickerComponentData?.value.isRange
    ? AppTimeRangeMode
    : AppTimeDefaultMode;
});
</script>

<style lang="scss" scoped>
.app-time-picker-content {
  &__picker {
    height: max-content;
    margin-bottom: var(--vpick--time-content-margin-bottom);
  }
}
</style>
