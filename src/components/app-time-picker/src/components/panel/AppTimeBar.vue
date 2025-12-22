<template>
  <div class="app-time-picker-bar">
    <AppTimeControlButton
      :disabled="!hasNumberValue(prevElement) || isDisabled(prevElement)"
      is-up-type
      @click="scrollUp"
    />
    <div class="app-time-picker-bar__column">
      <div class="app-time-picker-bar__separator"></div>
      <AppScrollbar
        ref="scrollbar"
        :show-vertical-scroll="false"
        class="app-time-picker-bar__column__scrollbar"
        @scroll="handleScroll"
      >
        <ul ref="list" class="app-time-picker-bar__column__list">
          <li
            v-for="(time, index) in elements"
            :key="index"
            :class="{
              'app-time-picker-bar__column__item--selected': isSelected(
                time.value
              ),
              'app-time-picker-bar__column__item--disabled': isDisabled(
                time.value
              ),
            }"
            class="app-time-picker-bar__column__item"
            @click="handleSelect(index)"
          >
            {{ time.label }}
          </li>
        </ul>
      </AppScrollbar>
    </div>
    <AppTimeControlButton
      :disabled="!hasNumberValue(nextElement) || isDisabled(nextElement)"
      @click="scrollDown"
    />
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import type { PerfectScrollbarExpose } from 'vue3-perfect-scrollbar';
import AppScrollbar from '@/ui/AppScrollbar/Index.vue';
import AppTimeControlButton from '../base/AppTimeControlButton.vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { debounce } from 'es-toolkit';
import { AppTimeBarType } from '../../enums/timeBarType';

const AmPmLabels = ['AM', 'PM'];

const props = withDefaults(
  defineProps<{
    type?: AppTimeBarType;
    enabledAmPm?: boolean;
    disabledValue?: (val: number) => boolean;
  }>(),
  {
    type: AppTimeBarType.Hours,
    enabledAmPm: false,
    disabledValue: undefined,
  }
);

const model = defineModel<number>();

const list = ref<HTMLElement | null>(null);
const scrollbar = ref<ComputedRef<PerfectScrollbarExpose> | null>(null);

const itemHeight = ref<number>(0);
const isRenderedList = ref(false);

let resizeObserver: ResizeObserver | null = null;

const activeElement = computed({
  get() {
    const index = elements.value.findIndex(el => el.value === model.value);
    return index !== -1 ? index : 0;
  },
  set(val: number) {
    const item = elements.value[val];
    if (item) {
      model.value = item.value;
    }
  },
});

const maxTime = computed(() => {
  switch (props.type) {
    case AppTimeBarType.Hours:
      return props.enabledAmPm ? 12 : 24;
    case AppTimeBarType.AmPm:
      return 2;
    default:
      return 60;
  }
});

const elements = computed<{ value: number; label: string }[]>(() => {
  const timeArray = Array.from({ length: maxTime.value }, (_, i) => {
    let value = i;

    if (props.type === AppTimeBarType.Hours && props.enabledAmPm) {
      value = i + 1;
    }

    let label = value < 10 ? `0${value}` : value.toString();

    if (props.type === AppTimeBarType.AmPm) {
      label = AmPmLabels[i];
    }

    return {
      value,
      label,
    };
  });

  if (props.type === AppTimeBarType.Hours && props.enabledAmPm) {
    return [timeArray[11], ...timeArray.slice(0, 11)];
  }

  return timeArray;
});

const listPaddingTop = computed(() => {
  if (!list.value) return 0;
  const style = window.getComputedStyle(list.value);
  return parseInt(style.paddingTop, 10) || 0;
});

const prevElement = computed(() => {
  const val = activeElement.value - 1;

  return !!elements.value[val] ? val : undefined;
});

const nextElement = computed(() => {
  const val = activeElement.value + 1;

  return !!elements.value[val] ? val : undefined;
});

const debouncedCentredScrollbar = debounce(() => {
  scrollToElement(activeElement.value);
}, 200);

watch(
  () => model.value,
  () => {
    debouncedCentredScrollbar();
  }
);

function resizeList() {
  calcItemHeight();
  if (!isRenderedList.value) {
    scrollbar.value?.ps?.update();

    if (
      scrollbar.value?.ps?.containerHeight ||
      scrollbar.value?.ps?.contentHeight
    ) {
      isRenderedList.value = true;
      scrollToElement(activeElement.value);
    }
  }
}

function calcItemHeight() {
  if (list.value) {
    const item = list.value.querySelector('li');

    if (item) {
      itemHeight.value = item.offsetHeight || 0;
    }
  }
}

function scrollToElement(index: number) {
  if (!list.value || !scrollbar.value?.ps) return;
  const scrollBarHeight = scrollbar.value.ps.containerHeight;
  const targetScroll =
    index * itemHeight.value -
    scrollBarHeight / 2 +
    itemHeight.value / 2 +
    listPaddingTop.value;

  scrollbar.value.ps.element.scroll &&
    scrollbar.value.ps.element.scroll({
      top: targetScroll,
    });
}

function handleSelect(val: number) {
  if (isDisabled(val)) {
    return;
  }
  activeElement.value = val;
  scrollToElement(val);
}

function isSelected(val: number) {
  return model.value === val;
}

function isDisabled(val: number) {
  if (props.disabledValue) {
    return props.disabledValue(val);
  }

  return false;
}

function scrollUp() {
  if (hasNumberValue(prevElement.value) && !isDisabled(prevElement.value)) {
    scrollToElement(prevElement.value as number);
  }
}

function scrollDown() {
  if (hasNumberValue(nextElement.value) && !isDisabled(nextElement.value)) {
    scrollToElement(nextElement.value as number);
  }
}

function hasNumberValue(value: unknown) {
  return typeof value === 'number';
}

function handleScroll(event: Event) {
  if (!event.target) {
    return;
  }
  const element = event.target as HTMLElement;

  const scrollTop = element.scrollTop;
  const scrollHeight = scrollbar.value!.ps!.containerHeight;

  const value = Math.min(
    Math.round(
      (scrollTop - (scrollHeight * 0.5 - 10) / itemHeight.value + 3) /
        itemHeight.value
    ),
    maxTime.value
  );

  if (!isDisabled(value) && Number.isFinite(value)) {
    debouncedCentredScrollbar();
    if (activeElement.value !== value) {
      activeElement.value = value;
    }
  }
}

onMounted(() => {
  if (list.value instanceof Element) {
    resizeObserver = new ResizeObserver(resizeList);
    resizeObserver.observe(list.value);
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
.app-time-picker-bar {
  width: var(--vpick--time-bar-content-widht);
  display: grid;
  gap: var(--vpick--time-bar-gap);
  grid-template-rows:
    var(--vpick--time-control-btn-size)
    var(--vpick--time-bar-content-height)
    var(--vpick--time-control-btn-size);

  &__separator {
    content: '';
    position: absolute;
    height: var(--vpick--time-bar-list-select-section-height);
    border-top: var(--vpick--time-bar-list-select-section-border-width)
      var(--vpick--time-bar-list-select-section-border-style)
      var(--vpick--time-bar-list-select-section-border-color);
    border-bottom: var(--vpick--time-bar-list-select-section-border-width)
      var(--vpick--time-bar-list-select-section-border-style)
      var(--vpick--time-bar-list-select-section-border-color);
    width: 100%;
    top: var(--vpick--time-bar-list-padding);
    left: 0;
  }

  &__column {
    position: relative;

    &__list {
      font-family: var(--vpick--font-family);
      margin: unset;
      list-style: unset;
      padding: var(--vpick--time-bar-list-padding) 0;
    }

    &__item {
      width: var(--vpick--time-bar-item-padding-width);
      padding: var(--vpick--time-bar-item-padding-height)
        var(--vpick--time-bar-item-padding-width);
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      color: var(--vpick--time-bar-item-color);
      word-break: normal;
      font-size: var(--vpick--time-bar-item-font-size);
      font-weight: var(--vpick--time-bar-item-font-weight);
      background-color: var(--vpick--time-bar-item-bg-color);
      transition: var(--vpick--animation-delay);
      box-sizing: content-box;

      &--selected:not(.app-time-picker-bar__column__item--disabled) {
        color: var(--vpick--time-bar-item-selected-color);
        background-color: var(--vpick--time-bar-item-selected-bg-color);
      }

      @media (hover: hover) {
        cursor: pointer;

        &:hover:not(.app-time-picker-bar__column__item--disabled):not(
            .app-time-picker-bar__column__item--selected
          ) {
          background: var(--vpick--time-bar-item-hover-bg-color);
          color: var(--vpick--time-bar-item-hover-color);
        }
      }

      &--disabled {
        cursor: not-allowed;
        color: var(--vpick--time-bar-item-disabled-color);
        background-color: var(--vpick--time-bar-item-disabled-bg-color);
      }
    }
  }
}
</style>
