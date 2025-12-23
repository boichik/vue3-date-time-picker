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
      '**/*.{interface|const|config}.ts',
      'src/index.ts',
      'src/components/**/index.ts',
    ],
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.spec.ts'],
    coverage: {
      reportsDirectory: './tests/_output',
      exclude: [
        '**/node_modules/**',
        '**/lib/**',
        '**/playground/**',
        '**/tests/**',
        '*.config.*',
        '**/docs/**',
        '**/*.{interface|const|config}.ts',
        'src/index.ts',
        'src/components/**/index.ts',
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
