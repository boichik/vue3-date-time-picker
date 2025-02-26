import type { DocsTableData, SlotColumns } from '../interfaces/DocsTable';

export const globalSlotTableData: DocsTableData<SlotColumns> = {
  columns: {
    name: { label: 'common__name' },
    description: { label: 'common__description' },
  },
  rows: [
    {
      name: {
        value: 'default',
      },
      description: {
        value: 'global_slots__default_desciption',
        needTranslate: true,
      },
    },
    {
      name: {
        value: 'separator',
      },
      description: {
        value: 'global_slots__separator_desciption',
        needTranslate: true,
      },
    },
  ],
};
