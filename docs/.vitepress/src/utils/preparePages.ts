import { omit } from 'es-toolkit';
import { navbar, PageItem, sidebar } from '../data/pages';
import { availableLocales } from '../data/locales';
import themeTranslations from '../data/themeTranslations';
import { en } from '../translations/en';
import { uk } from '../translations/uk';

const customTranslations = {
  en,
  uk,
};

const preparePagesByLocale = (pages: PageItem[], locale: string) => {
  const newMap: any[] = [];

  pages.forEach(page => {
    newMap.push({
      ...omit(page, ['lang', 'items', 'link']),
      text: page.lang[locale],
      ...(page.items
        ? { items: preparePagesByLocale(page.items, locale) }
        : {}),
      ...(page.link
        ? { link: !page.target ? `/${locale}${page.link}` : page.link }
        : {}),
    });
  });

  return newMap;
};

export function preparePages() {
  let localesObject: { [index: string]: any } = {};

  availableLocales.forEach(el => {
    localesObject[el.pathCode] = {
      ...omit(el, ['pathCode']),
      themeConfig: {
        ...(el.lang in themeTranslations ? themeTranslations[el.lang] : {}),
        nav: preparePagesByLocale(navbar, el.lang),
        sidebar: preparePagesByLocale(sidebar, el.lang),
        translations: customTranslations[el.lang],
      },
    };
  });

  return localesObject;
}
