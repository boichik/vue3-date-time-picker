import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';
import { preparePages } from './utils/preparePages';
import searchTranslations from './data/searchTranslations';

const baseUrl = '/@boichikpro/vue3-date-time-picker/';

export default defineConfig({
  title: 'Vue3DateTimePicker',
  description:
    'Modern, lightweight, and flexible date and time picker in Vue 3',
  base: baseUrl,
  head: [
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
        rel: 'stylesheet',
      },
    ],
    [
      'link',
      {
        href: `${baseUrl}favicon.svg`,
        rel: 'icon',
      },
    ],
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/boichik/@boichikpro/vue3-date-time-picker',
      },
    ],
    outline: {
      level: [2, 3],
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          uk: searchTranslations['uk'] as any,
        },
      },
    },
  },
  locales: {
    ...preparePages(),
  },

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
    },
  },
});
