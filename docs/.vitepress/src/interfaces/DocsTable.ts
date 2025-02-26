export interface DocsTableColumnData {
  label: string;
}

export interface DocsTableRowElement {
  value: string;
  version?: string;
  link?: {
    href: string;
    text: string;
  };
  infoPopover?: {
    content: string;
    needTranslate?: boolean;
  };
  needTranslate?: boolean;
}

export type DocsTableRow<T extends string> = Record<T, DocsTableRowElement>;

export type AttributeColumns = Record<
  'name' | 'description' | 'type' | 'default',
  DocsTableColumnData
>;

export type EventColumns = Record<
  'name' | 'description' | 'type',
  DocsTableColumnData
>;

export type SlotColumns = Record<'name' | 'description', DocsTableColumnData>;

export type ExposeColumns = EventColumns;

export interface DocsTableData<
  DocsTableColumn extends Record<string, DocsTableColumnData> = any,
> {
  columns: DocsTableColumn;
  rows: Array<{
    [Key in keyof DocsTableColumn]: DocsTableRowElement;
  }>;
}
