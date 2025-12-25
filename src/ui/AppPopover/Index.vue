<template>
  <div :id="id" ref="reference" class="app-popover" :tabindex="tabindex">
    <slot name="reference"></slot>
  </div>

  <component :is="clientOnlyPopoverContent ? 'client-only' : 'div'">
    <Teleport :to="teleportTo" :disabled="!appendToBody">
      <div
        v-show="isVisible"
        ref="content"
        class="app-popover__content"
        :style="contentStyle"
      >
        <slot name="content"></slot>
      </div>
    </Teleport>
  </component>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  inject,
  computed,
  useId,
  nextTick,
} from 'vue';
import { createPopper, type Placement } from '@popperjs/core';
import { debounce, isBoolean } from 'es-toolkit';
import { AppDateTimePopoverInternalSettingsProvide } from '@/const/globalProvide.const';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    placement?: Placement;
    openDelay?: number;
    closeDelay?: number;
    tabindex?: number;
    appendToBody?: boolean;
    disabled?: boolean;
    offset?: number;
    customAppend?: string;
    zIndex?: number;
    clientOnlyPopoverContent?: boolean;
  }>(),
  {
    placement: 'bottom',
    openDelay: 0,
    closeDelay: 150,
    tabindex: 0,
    appendToBody: false,
    disabled: false,
    offset: 12,
    zIndex: 1000,
    clientOnlyPopoverContent: false,
  }
);

const emit = defineEmits(['update:modelValue', 'open', 'close']);

const isVisible = ref(!props.disabled ? props.modelValue : false);
const id = useId();

const reference = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
let popperInstance: ReturnType<typeof createPopper> | null = null;

const forceUpdated = ref(false);

const settings = inject<{ forceUpdate?: boolean } | null>(
  AppDateTimePopoverInternalSettingsProvide,
  null
);

const contentStyle = computed(() => {
  return {
    zIndex: props.zIndex,
  };
});

const appendToBody = computed(() =>
  isBoolean(props.appendToBody) ? props.appendToBody : false
);

const teleportTo = computed(() => {
  return props.customAppend ? props.customAppend : 'body';
});

const openDelay = computed(() => {
  return getDelayValue(props.openDelay, 150);
});

const closeDelay = computed(() => {
  return getDelayValue(props.closeDelay, 0);
});

const showPopover = debounce(() => {
  if (props.disabled) return;

  isVisible.value = true;
  emit('open');

  nextTick(() => {
    popperInstance?.update();
  });
}, openDelay.value);

const hidePopover = debounce(() => {
  if (!props.disabled) {
    isVisible.value = false;
    emit('close');
  }
}, closeDelay.value);

function getDelayValue(value: unknown, defaultValue: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return defaultValue;
  }

  return value;
}

function initializePopper() {
  if (reference.value && content.value) {
    popperInstance = createPopper(reference.value, content.value, {
      placement: props.placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, props.offset],
          },
        },
      ],
    });
  }
}

watch(
  () => props.modelValue,
  newVal => {
    if (newVal) {
      if (!popperInstance) initializePopper();

      if (
        settings?.forceUpdate &&
        !forceUpdated.value &&
        popperInstance &&
        reference.value
      ) {
        popperInstance?.update();
        forceUpdated.value = true;
      }
      showPopover();
    } else {
      hidePopover();
    }
  }
);

onMounted(() => {
  initializePopper();
});

onBeforeUnmount(() => {
  if (popperInstance) {
    popperInstance.destroy();
  }
});
</script>

<style lang="scss" scoped>
.app-popover {
  width: 100%;

  &__content {
    width: max-content;
    background-color: var(--vpick--popover-bg-color);
    padding: var(--vpick--popover-padding);
    border: var(--vpick--popover-border);
    border-radius: var(--vpick--popover-border-radius);
    box-shadow: var(--vpick--popover-box-shadow);
  }
}
</style>
