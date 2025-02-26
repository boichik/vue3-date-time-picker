import type { DocsTableData, ExposeColumns } from '../interfaces/DocsTable';

export const globalExposeTableData: DocsTableData<ExposeColumns> = {
  columns: {
    name: { label: 'common__name' },
    description: { label: 'common__description' },
    type: { label: 'common__type' },
  },
  rows: [
    {
      name: {
        value: 'popoverVisible',
      },
      description: {
        value: 'global_exposes__popover_visible_description',
        needTranslate: true,
      },
      type: {
        value: '<code>object</code>',

        infoPopover: {
          content: '<code>Ref< boolean ></code>',
        },
      },
    },
    {
      name: {
        value: 'focus',
      },
      description: {
        value: 'global_exposes__focus_description',
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
        value: 'blur',
      },
      description: {
        value: 'global_exposes__blur_description',
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
