<template>
  <button
    :disabled="props.disabled"
    class="app-date-time-picker-button"
    @click="handleClick()"
  >
    <component :is="iconComponent" class="app-date-time-picker-button__icon" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ChevronDoubleLeftIcon from '@heroicons/vue/16/solid/ChevronDoubleLeftIcon';
import ChevronDoubleRightIcon from '@heroicons/vue/16/solid/ChevronDoubleRightIcon';
import ChevronLeftIcon from '@heroicons/vue/16/solid/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/vue/16/solid/ChevronRightIcon';

const emit = defineEmits(['click']);

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    isRightPosition?: boolean;
    doubleArrow?: boolean;
  }>(),
  { disabled: false, isRightPosition: false, doubleArrow: false }
);

const iconComponent = computed(() => {
  if (props.doubleArrow) {
    return !props.isRightPosition
      ? ChevronDoubleLeftIcon
      : ChevronDoubleRightIcon;
  }

  return !props.isRightPosition ? ChevronLeftIcon : ChevronRightIcon;
});

function handleClick() {
  if (!props.disabled) {
    emit('click');
  }
}
</script>

<style lang="scss" scoped>
.app-date-time-picker-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--vpick--control-btn-size);
  width: var(--vpick--control-btn-size);
  background-color: var(--vpick--control-btn-bg-color);
  border: unset;
  outline: unset;
  padding: 0;

  &__icon {
    width: var(--vpick--control-btn-icon-size);
    color: var(--vpick--control-btn-icon-color);
    transition: color var(--vpick--animation-delay);
  }

  @media (hover: hover) {
    cursor: pointer;

    &:hover:enabled {
      background-color: var(--vpick--control-hover-btn-bg-color);

      .app-date-time-picker-button__icon {
        color: var(--vpick--control-hover-btn-icon-color);
      }
    }
  }

  &:focus-visible:enabled {
    background-color: var(--vpick--control-focus-btn-bg-color);

    .app-date-time-picker-button__icon {
      color: var(--vpick--control-focus-btn-icon-color);
    }
  }

  &:disabled {
    cursor: not-allowed;
    background-color: var(--vpick--control-disabled-btn-bg-color);

    .app-date-time-picker-button__icon {
      color: var(--vpick--control-disabled-btn-icon-color);
    }
  }
}
</style>
