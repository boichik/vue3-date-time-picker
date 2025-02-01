<template>
  <button
    :disabled="disabled"
    :class="buttonClasses"
    class="app-button"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { isBoolean } from 'es-toolkit';
import { computed } from 'vue';

export type AppButtonType = 'submit' | 'default';

const DEFAULT_DISABLED = false;

const emit = defineEmits(['click']);

const props = withDefaults(
  defineProps<{ type?: AppButtonType; disabled?: boolean }>(),
  {
    type: 'default',
    disabled: DEFAULT_DISABLED,
  }
);

const disabled = computed(() =>
  isBoolean(props.disabled) ? props.disabled : DEFAULT_DISABLED
);

const buttonClasses = computed(() => {
  return {
    'app-button--default': props.type === 'default',
    'app-button--submit': props.type === 'submit',
  };
});

function handleClick() {
  if (!disabled.value) {
    emit('click');
  }
}
</script>

<style lang="scss" scoped>
.app-button {
  border: unset;
  outline: unset;
  font: var(--vpick--button-font);
  padding: var(--vpick--button-padding);
  border-radius: var(--vpick--button-border-radius);
  transition: var(--vpick--animation-delay);

  @media (hover: hover) {
    cursor: pointer;

    &--default:hover {
      background-color: var(--vpick--button-default-hover-bg-color);
      color: var(--vpick--button-default-hover-font-color);
    }

    &--submit:hover {
      background-color: var(--vpick--button-submit-hover-bg-color);
      color: var(--vpick--button-submit-hover-font-color);
    }
  }

  &:disabled {
    cursor: not-allowed;
  }

  &--default {
    background-color: var(--vpick--button-default-bg-color);
    color: var(--vpick--button-default-font-color);

    &:focus-visible {
      background-color: var(--vpick--button-default-focus-bg-color);
      color: var(--vpick--button-default-focus-font-color);
    }

    &:active {
      background-color: var(--vpick--button-default-active-bg-color);
      color: var(--vpick--button-default-active-font-color);
    }

    &:disabled {
      background-color: var(--vpick--button-default-disabled-bg-color);
      color: var(--vpick--button-default-disabled-font-color);
    }
  }

  &--submit {
    background-color: var(--vpick--button-submit-bg-color);
    color: var(--vpick--button-submit-font-color);

    &:focus-visible {
      background-color: var(--vpick--button-submit-focus-bg-color);
      color: var(--vpick--button-submit-focus-font-color);
    }

    &:active {
      background-color: var(--vpick--button-submit-active-bg-color);
      color: var(--vpick--button-submit-active-font-color);
    }

    &:disabled {
      background-color: var(--vpick--button-submit-active-bg-color);
      color: var(--vpick--button-submit-active-font-color);
    }
  }
}
</style>
