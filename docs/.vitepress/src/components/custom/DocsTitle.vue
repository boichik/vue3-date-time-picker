<template>
  <component :id="anchor" :is="element" tabindex="-1">
    {{ text }}
    <Badge v-if="version" type="tip" :text="version" />
    <a
      class="header-anchor"
      :href="`#${anchor}`"
      aria-label='Permalink to "DateTimePicker"'
      >&ZeroWidthSpace;</a
    >
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const {
  text,
  link,
  level = 1,
} = defineProps<{
  text: string;
  link?: string;
  level?: number;
  version?: string;
}>();

const anchor = computed(() => {
  if (!link) {
    return text.replaceAll(' ', '').toLowerCase();
  }

  return link;
});

const element = computed(() => {
  return `h${level}`;
});
</script>
