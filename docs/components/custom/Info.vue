<template>
  <div ref="tooltip" class="vi-tooltip">
    <AppPopover
      v-model="model"
      :offset="5"
      append-to-body
      custom-append=".vp-doc"
      placement="bottom-start"
    >
      <template #reference>
        <div
          ref="reference"
          class="vi-tooltip__reference"
          @click="model = !model"
        >
          <InformationCircleIcon class="vi-tooltip__icon" />
        </div>
      </template>
      <template #content>
        <div ref="content" class="vi-tooltip__content">
          <slot />
        </div>
      </template>
    </AppPopover>
  </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import { useClickOutside } from '../../../src/composables/useClickOutside';
import { useFocusInOutside } from '../../../src/composables/useFocusInOutside';
import AppPopover from '../../../src/ui/AppPopover.vue';

const model = ref(false);
const referece = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const tooltip = ref<HTMLElement | null>(null);

useClickOutside([tooltip, content, referece], (isOutside, event) => {
  if (isOutside) {
    model.value = false;
  }
});

useFocusInOutside([tooltip, content, referece], (isOutside, event) => {
  if (isOutside) {
    model.value = false;
  }
});
</script>

<style lang="scss" scoped>
.vi-tooltip {
  width: 24px;
  margin-left: 5px;
  &__reference {
    width: 24px;
    padding: 2px;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: var(--vp-code-bg);
      transition:
        color 0.25s,
        background-color 0.5s;
    }
  }
}
</style>
