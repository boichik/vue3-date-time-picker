export interface PageItem {
  lang: {
    uk: string;
    en: string;
  };
  link?: string;
  items?: PageItem[];
}

interface SidebarItem extends PageItem {
  collapsed?: boolean;
}

export const navbar: PageItem[] = [
  {
    lang: { en: 'Guide', uk: 'Керівництво' },
    link: '/guide/basic/installation',
  },
];

export const sidebar: SidebarItem[] = [
  {
    lang: {
      en: 'Basic',
      uk: 'Основне',
    },
    collapsed: false,
    items: [
      {
        lang: { en: 'Installation', uk: 'Встановлення' },
        link: '/guide/basic/installation',
      },
      {
        lang: { en: 'Quick Start', uk: 'Швидкий початок' },
        link: '/guide/basic/quick-start',
      },
    ],
  },
  {
    lang: {
      en: 'Components',
      uk: 'Компоненти',
    },
    collapsed: false,
    items: [
      {
        lang: { en: 'DateTimePicker', uk: 'DateTimePicker' },
        link: '/guide/components/app-date-time-picker',
      },
      {
        lang: { en: 'TimePicker', uk: 'TimePicker' },
        link: '/guide/components/app-time-picker',
      },
    ],
  },
  {
    lang: {
      en: 'Formats',
      uk: 'Формати',
    },
    collapsed: false,
    link: '/guide/formats',
  },
  {
    lang: {
      en: 'Styles / Customisation',
      uk: 'Стилі / Кастомізація',
    },
    collapsed: false,
    link: '/guide/style',
  },
];
