import type { DocsTableData, AttributeColumns } from '../interfaces/DocsTable';
import { globalAttributes } from './globalAttributes';

export const timePickerAttributes: DocsTableData<AttributeColumns> = {
  columns: {
    ...globalAttributes.columns,
  },
  rows: [
    {
      name: {
        value: 'v-model / model-value',
      },
      description: {
        value: 'time_attributes__v_model_description',
        needTranslate: true,
      },
      type: {
        value:
          '<div><code>null</code> / <code>Date</code> / <code>object</code></div>',

        infoPopover: {
          content: '<code>[Date, Date] | [null, null]</code>',
        },
      },
      default: {
        value: 'null',
      },
    },
    {
      name: {
        value: 'is-range',
      },
      description: {
        value: 'time_attributes__is_range_description',
        needTranslate: true,
      },
      type: {
        value: '<code>boolean</code>',
      },
      default: {
        value: 'false',
      },
    },
    {
      name: {
        value: 'time-format',
      },
      description: {
        value: 'time_attributes__time_format_description',
        needTranslate: true,
        link: {
          href: '#formats',
          text: 'common__more',
        },
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: 'HH:mm:ss',
      },
    },
    {
      name: {
        value: 'default-time',
      },
      description: {
        value: 'time_attributes__default_time_description',
        needTranslate: true,
        link: {
          href: '#defaulttime',
          text: 'common__more',
        },
      },
      type: {
        value: '<code>object</code>',
        infoPopover: {
          content: '<code>Date | [Date, Date]<code>',
        },
      },
      default: {
        value: 'new Date()',
      },
    },
    {
      name: {
        value: 'selectable-range',
      },
      description: {
        value: 'time_attributes__selectable_range_description',
        needTranslate: true,
        link: {
          href: '#limitthetimerange',
          text: 'common__more',
        },
      },
      type: {
        value: '<code>string</code> / <code>object</code>',
        infoPopover: {
          content: '<code>[string, string]</code>',
        },
      },
      default: {
        value: '"',
      },
    },

    ...globalAttributes.rows,
  ],
};
