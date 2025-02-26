<template>
  <DocsTable :data="data" />
</template>

<script setup lang="ts">
import DocsTable from '../custom/DocsTable.vue';
import { timePickerAttributes } from '../../const/timePickerAttributes';
import { globalEventTableData } from '../../const/globalEvents';
import { globalExposeTableData } from '../../const/globalExposes';
import { globalSlotTableData } from '../../const/globalSlots';
import { globalDefaultSlotTableData } from '../../const/globalDefaultSlot';
import { computed } from 'vue';

const props = defineProps<{
  type?: 'event' | 'expose' | 'slot' | 'attribute' | 'default-slot';
}>();

const data = computed(() => {
  switch (props.type) {
    case 'event':
      return globalEventTableData;
    case 'expose':
      return globalExposeTableData;
    case 'slot':
      return globalSlotTableData;
    case 'default-slot':
      return globalDefaultSlotTableData;
    case 'attribute':
    default:
      return timePickerAttributes;
  }
});
</script>
