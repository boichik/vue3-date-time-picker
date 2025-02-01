<template>
  <PerfectScrollbar
    ref="scrollbar"
    :class="getClasses"
    class="app-scrollbar"
    @scroll="handleScroll"
    @ps-scroll-y="handleScrollY"
    @ps-scroll-x="handleScrollX"
    @ps-scroll-up="handleScrollUp"
    @ps-scroll-down="handleScrollDown"
    @ps-scroll-left="handleScrollLeft"
    @ps-scroll-right="handleScrollRight"
    @ps-y-reach-start="handleYReachStart"
    @ps-y-reach-end="handleYReachEnd"
    @ps-x-reach-start="handleXReachStart"
    @ps-x-reach-end="handleXReachEnd"
  >
    <div class="app-scrollbar__content">
      <slot />
    </div>
  </PerfectScrollbar>
</template>

<script setup lang="ts">
import type { PerfectScrollbarExpose } from 'vue3-perfect-scrollbar';
import { computed, ref } from 'vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const emit = defineEmits([
  'scroll',
  'scroll-y',
  'scroll-x',
  'scroll-up',
  'scroll-down',
  'scroll-left',
  'scroll-right',
  'y-reach-start',
  'y-reach-end',
  'x-reach-start',
  'x-reach-end',
]);

const props = withDefaults(defineProps<{ showVerticalScroll?: boolean }>(), {
  showVerticalScroll: true,
});

const getClasses = computed(() => {
  return {
    'app-scrollbar--hide-y': !props.showVerticalScroll,
  };
});

const scrollbar = ref<PerfectScrollbarExpose | null>(null);

const exposeData = computed(() => scrollbar.value?.ps);

function handleScroll(event: Event) {
  emit('scroll', event);
}

function handleScrollY(event: Event) {
  emit('scroll-y', event);
}

function handleScrollX(event: Event) {
  emit('scroll-x', event);
}

function handleScrollUp(event: Event) {
  emit('scroll-up', event);
}

function handleScrollDown(event: Event) {
  emit('scroll-down', event);
}

function handleScrollLeft(event: Event) {
  emit('scroll-left', event);
}

function handleScrollRight(event: Event) {
  emit('scroll-right', event);
}

function handleYReachStart(event: Event) {
  emit('y-reach-start', event);
}

function handleYReachEnd(event: Event) {
  emit('y-reach-end', event);
}

function handleXReachStart(event: Event) {
  emit('x-reach-start', event);
}

function handleXReachEnd(event: Event) {
  emit('x-reach-end', event);
}

defineExpose({ ps: exposeData });
</script>

<style lang="scss" scoped>
.app-scrollbar {
  &:not(.app-scrollbar--hide-y) &__content {
    padding-right: var(--vpick--scrollbar-track-size);
  }
}
</style>

<style lang="scss">
.ps {
  max-height: 100%;
  position: relative;
  overflow: hidden !important;
  overflow-anchor: none;
  touch-action: auto;

  &__rail-x {
    height: var(--vpick--scrollbar-track-size);
    bottom: 0;
  }

  &__rail-y {
    width: var(--vpick--scrollbar-track-size);
    right: 0;
  }

  .app-scrollbar--hide-y &__rail-y {
    display: none !important;
  }

  &__rail-x,
  &__rail-y {
    display: none;
    opacity: 0;
    transition:
      background-color var(--vpick--animation-delay) linear,
      opacity var(--vpick--animation-delay) linear;
    position: absolute;
    background-color: transparent;

    &:hover {
      opacity: var(--vpick--scrollbar-track-hover-opacity);
      background-color: var(--vpick--scrollbar-track-hover-bg-color);

      .ps__thumb {
        &-x {
          height: var(--vpick--scrollbar-track-hover-thumb-size);
        }

        &-y {
          width: var(--vpick--scrollbar-track-hover-thumb-size);
        }

        &-x,
        &-y {
          background-color: var(--vpick--scrollbar-track-hover-thumb-bg-color);
        }
      }
    }
    &:focus {
      opacity: var(--vpick--scrollbar-track-focus-opacity);
      background-color: var(--vpick--scrollbar-track-focus-bg-color);

      .ps__thumb {
        &-x {
          height: var(--vpick--scrollbar-track-focus-thumb-size);
        }

        &-y {
          width: var(--vpick--scrollbar-track-focus-thumb-size);
        }

        &-x,
        &-y {
          background-color: var(--vpick--scrollbar-track-focus-thumb-bg-color);
        }
      }
    }
    &.ps--clicking {
      opacity: var(--vpick--scrollbar-track-active-opacity);
      background-color: var(--vpick--scrollbar-track-active-bg-color);

      .ps__thumb {
        &-x {
          height: var(--vpick--scrollbar-track-active-thumb-size);
        }

        &-y {
          width: var(--vpick--scrollbar-track-active-thumb-size);
        }

        &-x,
        &-y {
          background-color: var(--vpick--scrollbar-track-active-thumb-bg-color);
        }
      }
    }
  }

  &:hover > &__rail-x,
  &:hover > &__rail-y,
  &--focus > &__rail-x,
  &--focus > &__rail-y,
  &--scrolling-x > &__rail-x,
  &--scrolling-y > &__rail-y {
    opacity: var(--vpick--scrollbar-active-track-opacity);
  }

  &--active-x > &__rail-x,
  &--active-y > &__rail-y {
    display: block;
  }

  &__thumb {
    &-x {
      height: var(--vpick--scrollbar-thumb-default-size);
      bottom: var(--vpick--scrollbar-thumb-offset);
    }

    &-y {
      width: var(--vpick--scrollbar-thumb-default-size);
      right: var(--vpick--scrollbar-thumb-offset);
    }

    &-x,
    &-y {
      background-color: var(--vpick--scrollbar-thumb-bg-color);
      border-radius: var(--vpick--scrollbar-thumb-border-radius);
      transition:
        background-color --vpick--animation-delay linear,
        height --vpick--animation-delay ease-in-out;
      position: absolute;
    }
  }
}
</style>
