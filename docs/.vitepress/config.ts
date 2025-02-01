import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';
import { preparePages } from './utils/preparePages';
import searchTranslations from './data/searchTranslations';
// https://vitepress.dev/reference/site-config

export default defineConfig({
  title: 'Vue3DateTimePicker',
  description: 'date and time picker components for vue 3',
  head: [
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
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
