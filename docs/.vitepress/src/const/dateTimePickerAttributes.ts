import type { DocsTableData, AttributeColumns } from '../interfaces/DocsTable';
import { globalAttributes } from './globalAttributes';

export const dateTimePickerAttributes: DocsTableData<AttributeColumns> = {
  columns: {
    ...globalAttributes.columns,
  },
  rows: [
    {
      name: {
        value: 'v-model / model-value',
      },
      description: {
        value: 'date_time_attributes__v_model_description',
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
        value: 'date-format',
      },
      description: {
        value: 'date_time_attributes__date_format_description',
        link: {
          href: '#formats',
          text: 'common__more',
        },
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: 'yyyy/MM/dd',
      },
    },
    {
      name: {
        value: 'time-format',
      },
      description: {
        value: 'date_time_attributes__time_format_description',
        link: {
          href: '#formats',
          text: 'common__more',
        },
        needTranslate: true,
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
        value: 'combine-formats',
      },
      description: {
        value: 'date_time_attributes__combine_formats_description',
        needTranslate: true,
      },
      type: {
        value: '<code>boolean</code>',
      },
      default: {
        value: 'true',
      },
    },
    {
      name: {
        value: 'type',
      },
      description: {
        value: 'date_time_attributes__type_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',

        infoPopover: {
          content: '<code>date | datetime | daterange | datetimerange</code>',
        },
      },
      default: {
        value: '<code>date</code>',
      },
    },
    {
      name: {
        value: 'mode',
        version: '^0.1.0',
      },
      description: {
        value: 'date_time_attributes__mode_description',
        link: {
          href: '#modes',
          text: 'common__more',
        },
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',

        infoPopover: {
          content: '<code>day | month | year</code>',
        },
      },
      default: {
        value: '<code>day</code>',
      },
    },
    {
      name: {
        value: 'first-day-of-week',
      },
      description: {
        value: 'date_time_attributes__first_day_of_week_description',
        needTranslate: true,
      },
      type: {
        value: '<code>number</code>',

        infoPopover: {
          content: '<code>1 | 2 | 3 | 4 | 5 | 6 | 7</code>',
        },
      },
      default: {
        value: '1',
      },
    },
    {
      name: {
        value: 'weekday-format',
      },
      description: {
        value: 'date_time_attributes__weekday_format_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',

        infoPopover: {
          content: '<code>long | short | narrow</code>',
        },
      },
      default: {
        value: '<code>short</code>',
      },
    },
    {
      name: {
        value: 'month-cell-format',
      },
      description: {
        value: 'date_time_attributes__month_cell_format_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',

        infoPopover: {
          content: '<code>long | short | narrow | numeric | 2-digit</code>',
        },
      },
      default: {
        value: '<code>short</code>',
      },
    },
    {
      name: {
        value: 'month-button-format',
      },
      description: {
        value: 'date_time_attributes__month_button_format_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',

        infoPopover: {
          content: '<code>long | short | narrow | numeric | 2-digit</code>',
        },
      },
      default: {
        value: '<code>long</code>',
      },
    },
    {
      name: {
        value: 'shortcuts',
      },
      description: {
        value: 'date_time_attributes__shortcuts_description',
        link: {
          href: '#shortcuts',
          text: 'common__more',
        },
        needTranslate: true,
      },
      type: {
        value: '<code>object</code>',

        infoPopover: {
          content:
            '<code>Array<{ "text": string; "value": Date | null | (Date | null)[] }></code>',
        },
      },
      default: {
        value: '[]',
      },
    },
    {
      name: {
        value: 'default-time',
      },
      description: {
        value: 'date_time_attributes__default_time_description',
        link: {
          href: '#default-time',
          text: 'common__more',
        },
        needTranslate: true,
      },
      type: {
        value: '<code>string</code> / <code>object</code>',

        infoPopover: {
          content: '<code>string[]</code>',
        },
      },
      default: {
        value: '"',
      },
    },
    {
      name: {
        value: 'locale',
      },
      description: {
        value: 'date_time_attributes__locale_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',

        infoPopover: {
          content: '<code>Intl.LocalesArgument</code>',
        },
      },
      default: {
        value: 'en',
      },
    },
    {
      name: {
        value: 'time-options',
      },
      description: {
        value: 'date_time_attributes__time_options_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',

        infoPopover: {
          content:
            '<div class="vi-tooltip-list">{<ul><li>placeholder?: string;</li><li>startPlaceholder?: string;</li><li>endPlaceholder?: string;</li><li>applyText?: string;</li><li>cancelText?: string;</li><li>nextText?: string;</li></ul>}</div>',
        },
      },
      default: {
        value: '{}',
      },
    },
    {
      name: {
        value: 'disabled-date',
      },
      description: {
        value: 'date_time_attributes__disabled_date_description',
        needTranslate: true,
      },
      type: {
        value: '<code>Function</code>',

        infoPopover: {
          content: '<code>(date: Date) => boolean</code>',
        },
      },
      default: {
        value: '—',
      },
    },
    {
      name: {
        value: 'hide-offset-day',
        version: '^0.3.0',
      },
      description: {
        value: 'date_time_attributes__hide_offset_day_description',
        needTranslate: true,
      },
      type: {
        value: '<code>false</code>',
      },
      default: {
        value: 'false',
      },
    },
    ...globalAttributes.rows,
  ],
};
