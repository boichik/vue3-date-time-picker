import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: './lib',
      insertTypesEntry: true,
      rollupTypes: true,
      include: ['src/**/*'],
      exclude: ['src/env.d.ts'],
      compilerOptions: {
        skipLibCheck: true,
      },
      afterBuild: () => {
        import('fs').then(fs => {
          const filePath = resolve(__dirname, 'lib/variables.d.ts');
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: './lib',
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        variables: resolve(__dirname, 'src/styles/variables.css'),
      },
      formats: ['es', 'cjs'],
      name: 'Vue3ADateTimePicker',
    },
    rollupOptions: {
      external: ['vue', /@vue\/.*/, '@heroicons/vue', 'date-fns', 'vue-i18n'],

      output: {
        globals: {
          vue: 'Vue',
          '@heroicons/vue': 'HeroIconsVue',
          'date-fns': 'dateFns',
          'vue-i18n': 'VueI18n',
        },
        assetFileNames: assetInfo => {
          console.log(assetInfo);
          if (!!assetInfo.name!.match(/.css/)) return 'assets/[name][extname]';
          return '[name][extname]';
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
});
