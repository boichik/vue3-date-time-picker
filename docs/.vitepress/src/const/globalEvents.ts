import type { DocsTableData, EventColumns } from '../interfaces/DocsTable';

export const globalEventTableData: DocsTableData<EventColumns> = {
  columns: {
    name: { label: 'common__name' },
    description: { label: 'common__description' },
    type: { label: 'common__type' },
  },
  rows: [
    {
      name: {
        value: 'change',
      },
      description: {
        value: 'global_events__change_description',
        needTranslate: true,
      },
      type: {
        value: '<code>Function</code>',

        infoPopover: {
          content: '<code>(val: typeof v-model) => void</code>',
        },
      },
    },
    {
      name: {
        value: 'focus',
      },
      description: {
        value: 'global_events__focus_description',
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
        value: 'global_events__blur_description',
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
