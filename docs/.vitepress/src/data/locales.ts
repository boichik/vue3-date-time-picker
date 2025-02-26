interface Locale {
  pathCode: string;
  label: string;
  lang: string;
  link: string;
}

export const availableLocales: Locale[] = [
  {
    pathCode: 'root',
    label: 'English',
    lang: 'en',
    link: '/en/',
  },
  {
    pathCode: 'uk',
    label: 'Українська',
    lang: 'uk',
    link: '/uk/',
  },
];
