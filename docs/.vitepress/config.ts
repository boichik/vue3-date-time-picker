import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';
import { preparePages } from './utils/preparePages';
import searchTranslations from './data/searchTranslations';

export default defineConfig({
  title: 'Vue3DateTimePicker',
  description:
    'Modern, lightweight, and flexible date and time picker in Vue 3',
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
        href: '/favicon.svg',
        rel: 'icon',
      },
    ],
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/boichik/vue3-date-time-picker',
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
