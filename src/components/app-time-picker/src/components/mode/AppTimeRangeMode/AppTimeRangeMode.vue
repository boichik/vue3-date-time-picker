<template>
  <div :class="containerClasses">
    <section
      v-show="shouldShowStart"
      ref="firstSection"
      class="app-time-picker-range-mode__section"
    >
      <AppTimeController
        v-model="startModel"
        :selectable-range="startSelectableRange"
      />
    </section>

    <section v-show="shouldShowEnd" class="app-time-picker-range-mode__section">
      <AppTimeController
        v-model="endModel"
        :selectable-range="endSelectableRange"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type {
  AppTimePickerComponentData,
  AppTimePickerModel,
} from '../../../interfaces/index.interface';
import { computed, inject, ref, useTemplateRef, watch } from 'vue';
import AppTimeController from '../../controller/AppController.vue';
import { isDate } from '@/utils/isDate';
import {
  convertDateToTime,
  leadToValidDateRelativeToRange,
  parseSelectableRange,
} from '../../../utils';
import {
  AppTimePickerComponentDataProvide,
  AppTimeRangeModeState,
} from '../../../const';
import { useIsFullyVisibleRangeContent } from '@/composables/useIsFullyVisibleRangeContent';

const model = defineModel<AppTimePickerModel>({ default: [null, null] });

const firstSection = useTemplateRef<HTMLElement | null>('firstSection');

const { isFullyVisible } = useIsFullyVisibleRangeContent(firstSection);

const rangeModeState = inject<{
  isCompact: boolean;
  step: 'start' | 'end';
  next: () => void;
}>(AppTimeRangeModeState);

watch(
  isFullyVisible,
  val => {
    if (rangeModeState) {
      rangeModeState.isCompact = !val;
      if (val) {
        rangeModeState.step = 'start';
      }
    }
  },
  { immediate: true }
);

if (rangeModeState) {
  rangeModeState.next = () => {
    rangeModeState.step = 'end';
  };
}

const shouldShowStart = computed(() => {
  if (!rangeModeState?.isCompact) return true;
  return rangeModeState.step === 'start';
});

const shouldShowEnd = computed(() => {
  if (!rangeModeState?.isCompact) return true;
  return rangeModeState.step === 'end';
});

function prepareModel(value: AppTimePickerModel, index = 0) {
  if (Array.isArray(value) && value.length && isDate(value[index])) {
    return value[index];
  }

  return null;
}

const startModel = ref<Date | null>(null);
const endModel = ref<Date | null>(null);
const isInternalUpdate = ref<boolean>(false);

const containerClasses = computed(() => ({
  'app-time-picker-range-mode': true,
  'app-time-picker-range-mode--min': !isFullyVisible.value,
}));

watch(
  () => model.value,
  val => {
    if (isInternalUpdate.value) {
      isInternalUpdate.value = false;
      return;
    }
    startModel.value = prepareModel(val);
    endModel.value = prepareModel(val, 1);
  }
);

watch([startModel, endModel], ([newStart, newEnd]) => {
  if (Boolean(newStart) && Boolean(newEnd)) {
    isInternalUpdate.value = true;
    model.value = [newStart, newEnd];
  }
});

const appTimePickerComponentData =
  inject<ComputedRef<AppTimePickerComponentData> | null>(
    AppTimePickerComponentDataProvide,
    null
  );

const startSelectableRange = computed(() => getSelectableRange());
const endSelectableRange = computed(() => getSelectableRange(1));

function getSelectableRange(index = 0) {
  const { startSelectableRange, endSelectableRange } =
    appTimePickerComponentData?.value || {};

  if (index === 0 && startSelectableRange) {
    return startSelectableRange;
  }

  if (index === 1 && endSelectableRange) {
    return endSelectableRange;
  }

  const selectedModel = index === 0 ? endModel.value : startModel.value;

  const template = (val: string) =>
    index === 0 ? `00:00:00 - ${val}` : `${val} - 23:59:59`;

  const time = convertDateToTime(selectedModel);

  const rangeFromModel = time ? template(time) : undefined;

  return rangeFromModel;
}

const defaultTime = computed<Date[]>(() => {
  const { startDefaultTime, endDefaultTime } =
    appTimePickerComponentData!.value || {};

  return [startDefaultTime, endDefaultTime];
});

function getValueForModel(index = 0) {
  const value = prepareModel(model.value, index) ?? defaultTime.value[index];
  const range = index ? endSelectableRange.value : startSelectableRange.value;

  return leadToValidDateRelativeToRange(
    value,
    parseSelectableRange(range, value)
  );
}

function prepareModelWithDefaults() {
  startModel.value = getValueForModel();
  endModel.value = getValueForModel(1);
}

prepareModelWithDefaults();
</script>

<style lang="scss" scoped>
.app-time-picker-range-mode {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  &--min {
    grid-template-columns: 1fr;
  }
}
</style>
