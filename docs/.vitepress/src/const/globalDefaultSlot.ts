import type { DocsTableData, ExposeColumns } from '../interfaces/DocsTable';

export const globalDefaultSlotTableData: DocsTableData<ExposeColumns> = {
  columns: {
    name: { label: 'common__name' },
    description: { label: 'common__description' },
    type: { label: 'common__type' },
  },
  rows: [
    {
      name: {
        value: 'value',
      },
      description: {
        value: 'global_default_slot__value_description',
        needTranslate: true,
      },
      type: {
        value: '<code>null</code> / <code>Date</code> / <code>object</code>',

        infoPopover: {
          content: '<code>[Date, Date] | [null, null]</code>',
        },
      },
    },
    {
      name: {
        value: 'popoverVisible',
      },
      description: {
        value: 'global_default_slot__popover_visible_description',
        needTranslate: true,
      },
      type: {
        value: 'boolean',
      },
    },
    {
      name: {
        value: 'input',
      },
      description: {
        value: 'global_default_slot__input_description',
        needTranslate: true,
      },
      type: {
        value: '<code>Function</code>',

        infoPopover: {
          content:
            '<code>(value: Date | null | (Date | null)[]) => void</code>',
        },
      },
    },
    {
      name: {
        value: 'blur',
      },
      description: {
        value: 'global_default_slot__blur_description',
        needTranslate: true,
      },
      type: {
        value: '<code>Function</code>',

        infoPopover: {
          content: '<code>() => void</code>',
        },
      },
    },
    {
      name: {
        value: 'focus',
      },
      description: {
        value: 'global_default_slot__focus_description',
        needTranslate: true,
      },
      type: {
        value: '<code>Function</code>',

        infoPopover: {
          content: '<code>() => void</code>',
        },
      },
    },
  ],
};
