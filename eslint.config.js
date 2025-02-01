import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import eslintPluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVitest from 'eslint-plugin-vitest';
import globals from 'globals';

export default typescriptEslint.config(
  {
    ignores: [
      'node_modules/**/*',
      'lib/**/*',
      '*.lock',
      'playground/**/*',
      '.vscode/**/*',
      'tests/_output/**',
      '**/*.d.ts',
      'docs/**/*',
      '*.config.js',
      '*.config.ts',
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
      eslintPluginVitest.configs.recommended,
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: typescriptEslint.parser,
      },
      globals: {
        ...globals.browser,
        ...eslintPluginVitest.environments.env.globals,
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-extra-boolean-cast': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/no-unused-expressions': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-dupe-keys': 'off',
    },
  },
  {
    files: ['tests/**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vitest/expect-expect': 'off',
    },
  },
  eslintConfigPrettier
);
