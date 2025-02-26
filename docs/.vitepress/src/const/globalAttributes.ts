import type { DocsTableData, AttributeColumns } from '../interfaces/DocsTable';

export const globalAttributes: DocsTableData<AttributeColumns> = {
  columns: {
    name: {
      label: 'common__name',
    },
    description: {
      label: 'common__description',
    },
    type: {
      label: 'common__type',
    },
    default: {
      label: 'common__default',
    },
  },
  rows: [
    {
      name: {
        value: 'auto-apply',
        version: '$VERSION',
      },
      description: {
        value: 'global_attributes__auto_apply_description',
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
        value: 'disabled',
      },
      description: {
        value: 'global_attributes__disabled_description',
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
        value: 'readonly',
      },
      description: {
        value: 'global_attributes__readonly_description',
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
        value: 'input-readonly',
        version: '^0.0.2',
      },
      description: {
        value: 'global_attributes__input_readonly_description',
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
        value: 'clearable',
      },
      description: {
        value: 'global_attributes__clearable_description',
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
        value: 'timezone',
      },
      description: {
        value: 'global_attributes__timezone_description',
        needTranslate: true,
        link: {
          href: '#timezone',
          text: 'common__more',
        },
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: '"',
      },
    },
    {
      name: {
        value: 'placeholder',
      },
      description: {
        value: 'global_attributes__placeholder_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: '"',
      },
    },
    {
      name: {
        value: 'start-placeholder',
      },
      description: {
        value: 'global_attributes__start_placeholder_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: '"',
      },
    },
    {
      name: {
        value: 'end-placeholder',
      },
      description: {
        value: 'global_attributes__end_placeholder_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: '"',
      },
    },
    {
      name: {
        value: 'align',
      },
      description: {
        value: 'global_attributes__align_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',

        infoPopover: {
          content: '<code>left | center | right</code>',
        },
      },
      default: {
        value: '<code>left</code>',
      },
    },
    {
      name: {
        value: 'start-id',
        version: '$VERSION',
      },
      description: {
        value: 'global_attributes__start_id_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: '"',
      },
    },
    {
      name: {
        value: 'end-id',
        version: '$VERSION',
      },
      description: {
        value: 'global_attributes__end_id_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: '"',
      },
    },
    {
      name: {
        value: 'start-name',
        version: '$VERSION',
      },
      description: {
        value: 'global_attributes__start_name_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: '"',
      },
    },
    {
      name: {
        value: 'end-name',
        version: '$VERSION',
      },
      description: {
        value: 'global_attributes__end_name_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: '"',
      },
    },
    {
      name: {
        value: 'apply-text',
      },
      description: {
        value: 'global_attributes__apply_text_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: 'global_attributes__apply_text_default',
        needTranslate: true,
      },
    },
    {
      name: {
        value: 'cancel-text',
      },
      description: {
        value: 'global_attributes__cancel_text_description',
        needTranslate: true,
      },
      type: {
        value: '<code>string</code>',
      },
      default: {
        value: 'global_attributes__cancel_text_default',
        needTranslate: true,
      },
    },
    {
      name: {
        value: 'invalid',
      },
      description: {
        value: 'global_attributes__invalid_description',
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
        value: 'open-delay',
      },
      description: {
        value: 'global_attributes__open_delay_description',
        needTranslate: true,
      },
      type: {
        value: '<code>number</code>',
      },
      default: {
        value: '0',
      },
    },
    {
      name: {
        value: 'close-delay',
      },
      description: {
        value: 'global_attributes__close_delay_description',
        needTranslate: true,
      },
      type: {
        value: '<code>number</code>',
      },
      default: {
        value: '150',
      },
    },
    {
      name: {
        value: 'append-to-body',
      },
      description: {
        value: 'global_attributes__append_to_body_description',
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
        value: 'stay-opened',
      },
      description: {
        value: 'global_attributes__stay_opened_description',
        needTranslate: true,
      },
      type: {
        value: '<code>boolean</code>',
      },
      default: {
        value: 'false',
      },
    },
  ],
};
