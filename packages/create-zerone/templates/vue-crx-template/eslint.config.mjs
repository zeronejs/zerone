import eslintConfig from '@zeronejs/eslint-config-vue3/recommended';

export default [
  {
    ignores: ['extension/**', 'static/**'],
  },
  ...eslintConfig,
  {
    rules: {},
  },
];
