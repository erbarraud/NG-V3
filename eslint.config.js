import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  { ignores: ['dist', 'node_modules', '*.d.ts'] },
  
  // Base JavaScript/TypeScript configuration
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // General code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  
  // Vue-specific configuration
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },
    rules: {
      // Vue-specific rules
      'vue/multi-word-component-names': 'off', // Allow single word component names like Dashboard, Card
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/no-unused-refs': 'error',
      
      // TypeScript in Vue
      '@typescript-eslint/no-unused-vars': 'off', // Handled by Vue
      '@typescript-eslint/no-empty-object-type': 'off', // Allow empty interfaces for component props
      'no-undef': 'off', // TypeScript handles this
    },
  }
];
