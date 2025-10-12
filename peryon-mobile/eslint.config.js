const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // Apply to all JS/TS files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'build/',
      '*.config.js',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // React Native globals
        __DEV__: 'readonly',
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        // ES6 globals
        Promise: 'readonly',
        Set: 'readonly',
        Map: 'readonly',
        // Browser/JavaScript globals
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // TypeScript JSX globals
        JSX: 'readonly',
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      'prettier': prettier,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // ESLint recommended rules
      ...js.configs.recommended.rules,
      
      // TypeScript ESLint recommended rules
      ...typescript.configs.recommended.rules,
      
      // React recommended rules
      ...react.configs.recommended.rules,
      
      // React Hooks recommended rules
      ...reactHooks.configs.recommended.rules,
      
      // React Native recommended rules
      ...reactNative.configs.all.rules,
      
      // Prettier integration
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      
      // React specific rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // React Native specific rules
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      
      // General rules
      'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];