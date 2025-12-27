<template>
  <div class="app-button-panel">
    <AppButton @click="handleCancel">
      {{ translate('dp__cancel', defaultText.cancel) }}
    </AppButton>
    <AppButton :disabled="disabled" type="submit" @click="handleApply">
      {{ translate('dp__apply', defaultText.apply) }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/ui/AppButton/Index.vue';
import { computed } from 'vue';
import { useLocalization } from '@/composables/useLocalization';

const DEFAULT_CANCEL_TEXT = 'Cancel';
const DEFAULT_APPLY_TEXT = 'Apply';

const localization = useLocalization();

const emit = defineEmits(['apply', 'cancel']);

const props = defineProps<{
  disabled?: boolean;
  cancelText?: string;
  applyText?: string;
}>();

const disabled = computed(() => Boolean(props.disabled));

const defaultText = computed(() => {
  const { cancelText, applyText } = props;

  return {
    cancel: cancelText || DEFAULT_CANCEL_TEXT,
    apply: applyText || DEFAULT_APPLY_TEXT,
  };
});

function translate(value: string, defaultValue: string) {
  if (!localization) {
    return defaultValue;
  }

  return localization.t(value) === value ? defaultValue : localization.t(value);
}

function handleCancel() {
  emit('cancel');
}

function handleApply() {
  emit('apply');
}
</script>

<style lang="scss" scoped>
.app-button-panel {
  display: flex;
  justify-content: var(--vpick--button-panel-justify-content);
  align-items: center;
  gap: var(--vpick--button-panel-gap);
  padding: var(--vpick--button-panel-padding);
  border-top: var(--vpick--button-panel-border-top);
}
</style>
