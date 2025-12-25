import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const excludePatterns = [
  '**/node_modules/**',
  '**/lib/**',
  '**/playground/**',
  '**/tests/**',
  '*.config.*',
  '**/docs/**',
  '**/*.interface.ts',
  '**/*.const.ts',
  '**/*.config.ts',
  'src/index.ts',
  'src/components/**/index.ts',
  'declarations',
];

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
    exclude: excludePatterns,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './tests/_output',
      exclude: excludePatterns,
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
