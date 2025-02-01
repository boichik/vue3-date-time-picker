<template>
  <button
    :disabled="props.disabled"
    tabindex="-1"
    class="app-time-picker-control-button"
    @click="handleClick"
  >
    <component
      :is="iconComponent"
      class="app-time-picker-control-button__icon"
    />
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import ChevronUpIcon from '@heroicons/vue/16/solid/ChevronUpIcon';
import ChevronDownIcon from '@heroicons/vue/16/solid/ChevronDownIcon';

const emit = defineEmits(['click']);

const props = withDefaults(
  defineProps<{ disabled?: boolean; isUpType?: boolean }>(),
  {
    disabled: false,
  }
);

const iconComponent = computed(() => {
  return props.isUpType ? ChevronUpIcon : ChevronDownIcon;
});

function handleClick() {
  if (!props.disabled) {
    emit('click');
  }
}
</script>
<style lang="scss" scoped>
.app-time-picker-control-button {
  width: var(--vpick--time-control-btn-size);
  height: var(--vpick--time-control-btn-size);
  padding: unset;
  background-color: var(--vpick--time-control-btn-bg-color);
  border: unset;
  outline: unset;
  transition: var(--vpick--animation-delay);
  margin: 0 auto;

  &__icon {
    width: var(--vpick--time-control-btn-size);
    color: var(--vpick--time-control-btn-icon-color);
  }

  @media (hover: hover) {
    cursor: pointer;

    &:hover:enabled {
      background-color: var(--vpick--time-control-btn-hover-bg-color);

      .app-time-picker-control-button__icon {
        color: var(--vpick--time-control-btn-hover-icon-color);
      }
    }
  }

  &:focus-visible:enabled {
    background-color: var(--vpick--time-control-btn-focus-bg-color);

    .app-time-picker-control-button__icon {
      color: var(--vpick--time-control-btn-focus-icon-color);
    }
  }

  &:disabled {
    cursor: not-allowed;
    background-color: var(--vpick--time-control-btn-disabled-bg-color);

    .app-time-picker-control-button__icon {
      color: var(--vpick--time-control-btn-disabled-icon-color);
    }
  }
}
</style>
