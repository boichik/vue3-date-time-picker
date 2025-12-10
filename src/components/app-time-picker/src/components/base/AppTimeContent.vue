<template>
  <div class="app-time-picker-content">
    <div class="app-time-picker-content__picker">
      <component :is="currentComponent" v-model="model" />
    </div>

    <AppButtonPanel
      :disabled="appButtonData.disabledApplyButton"
      :cancel-text="appButtonData.cancelText"
      :apply-text="currentApplyText"
      class="app-time-picker-content__panel"
      @apply="handleApply"
      @cancel="() => appButtonData.cancelChange && appButtonData.cancelChange()"
    />
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef, Component } from 'vue';
import type {
  AppTimePickerComponentData,
  AppTimePickerModel,
} from '../../interfaces/index';
import { inject, computed, reactive, provide } from 'vue';
import AppButtonPanel from '@/ui/AppButtonPanel.vue';
import AppTimeDefaultMode from '../mode/AppTimeDefaultMode.vue';
import AppTimeRangeMode from '../mode/AppTimeRangeMode.vue';
import {
  AppTimePickerComponentDataProvide,
  AppTimeRangeModeState,
} from '../../const';

const model = defineModel<AppTimePickerModel>();

const rangeModeState = reactive({
  isCompact: false,
  step: 'start' as 'start' | 'end',
  next: () => {},
});

provide(AppTimeRangeModeState, rangeModeState);

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

const isNextStep = computed(() => {
  return rangeModeState.isCompact && rangeModeState.step === 'start';
});

const currentApplyText = computed(() => {
  if (isNextStep.value) {
    return appTimePickerComponentData?.value?.nextText;
  }
  return appButtonData.value.applyText;
});

function handleApply() {
  if (isNextStep.value) {
    rangeModeState.next();
  } else {
    appButtonData.value.applyChange && appButtonData.value.applyChange();
  }
}

const currentComponent = computed<Component>(() => {
  return appTimePickerComponentData?.value?.isRange
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
