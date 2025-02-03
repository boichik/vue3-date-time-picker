import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => ['client-only'].includes(tag),
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/lib/**',
      '**/playground/**',
      '**/tests/_output/**',
      '**/docs/**',
    ],

    include: ['**/tests/data/**/*.spec.ts'],
    coverage: {
      reportsDirectory: './tests/_output',
      exclude: [
        '**/node_modules/**',
        '**/lib/**',
        '**/playground/**',
        '**/tests/**',
        '*.config.*',
        '**/docs/**',
        'declarations',
      ],
    },
    env: {
      TZ: 'Europe/Kyiv',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
});
