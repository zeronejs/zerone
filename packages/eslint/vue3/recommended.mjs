import js from '@eslint/js'
import markdown from '@eslint/markdown'
// import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import vue from 'eslint-plugin-vue'
import jsonc from 'eslint-plugin-jsonc'
import esimport from 'eslint-plugin-import-x'
import prettier from 'eslint-plugin-prettier/recommended'
import unicorn from 'eslint-plugin-unicorn'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import pluginVitest from '@vitest/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  js.configs.recommended,
  // comments.recommended,
  {
    plugins: {
      unicorn,
      import: esimport,
      '@stylistic': stylistic,
    },
  },
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  ...jsonc.configs['flat/recommended-with-jsonc'],
  ...markdown.configs.processor,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/base'],
  ...vue.configs['flat/essential'],
  ...vue.configs['flat/strongly-recommended'],
  ...vue.configs['flat/recommended'],
  prettier,
  {
    languageOptions: {
      // ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        // TODO: separate node and browser
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // @eslint/js
      "eqeqeq": "warn",
      camelcase: 'off',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-debugger': 'warn',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
      'no-return-await': 'error',
      'no-var': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': [
        'warn',
        { destructuring: 'all', ignoreReadBeforeAssign: true },
      ],
      'prefer-arrow-callback': [
        'error',
        { allowNamedFunctions: false, allowUnboundThis: true },
      ],
      'object-shorthand': [
        'error',
        'always',
        { ignoreConstructors: false, avoidQuotes: true },
      ],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'no-redeclare': 'off',
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'no-alert': 'warn',
      'no-case-declarations': 'error',
      'no-multi-str': 'error',
      'no-with': 'error',
      'no-void': 'error',
      'sort-imports': [
        'warn',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],
      'prefer-exponentiation-operator': 'error',

      // @eslint-community/eslint-comments
      //   '@eslint-community/eslint-comments/disable-enable-pair': [
      //     'error',
      //     { allowWholeFile: true },
      //   ],

      // prettier
      'prettier/prettier': 'error',
      // import
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              pattern: 'vue',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@vue/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@element-plus/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
        },
      ],
      'import/no-unresolved': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/named': 'off',

      // unicorn
      'unicorn/custom-error-definition': 'error',
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/import-index': 'error',
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-array-method-this-argument': 'error',
      'unicorn/no-array-push-push': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/no-hex-escape': 'error',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-invalid-remove-event-listener': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/no-unsafe-regex': 'off',
      'unicorn/number-literal-case': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-index-of': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-date-now': 'error',
      'unicorn/prefer-dom-node-dataset': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-keyboard-event-key': 'error',
      'unicorn/prefer-math-trunc': 'error',
      'unicorn/prefer-modern-dom-apis': 'error',
      'unicorn/prefer-negative-index': 'error',
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-prototype-methods': 'error',
      'unicorn/prefer-query-selector': 'error',
      'unicorn/prefer-reflect-apply': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/throw-new-error': 'error',

      // @typescript-eslint
      '@typescript-eslint/no-unused-vars': [
        "error",
        { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" },
      ],
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/ban-ts-comment': ['off', { 'ts-ignore': false }],
      // Due to the latest "@typescript-eslint recommended" added some additional rules,
      // temporarily off the following rules to keep the behavior the same as before.
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'off',

      // stylistic
      '@stylistic/padding-line-between-statements': [
        'error',
        // return
        { blankLine: 'always', prev: '*', next: 'return' },
        // import
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        // 变量
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      ],
      // vue
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/prefer-import-from-vue': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'vue/v-on-event-hyphenation': 0, // @绑定事件名称规范
      'vue/attribute-hyphenation': 0, // 属性名称规范
      'vue/prop-name-casing': 0, // prop名驼峰
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/attributes-order': [
        'warn',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'SLOT',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            // 'OTHER_ATTR',
            'ATTR_SHORTHAND_BOOL',
            // ['ATTR_STATIC', 'ATTR_DYNAMIC'],
            'ATTR_STATIC',
            'ATTR_DYNAMIC',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        },
      ],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          pathPattern: '^$',
          order: [
            'name',
            'version',
            'private',
            'packageManager',
            'description',
            'type',
            'keywords',
            'homepage',
            'bugs',
            'license',
            'author',
            'contributors',
            'funding',
            'files',
            'main',
            'module',
            'exports',
            'unpkg',
            'jsdelivr',
            'browser',
            'bin',
            'man',
            'directories',
            'repository',
            'publishConfig',
            'scripts',
            'peerDependencies',
            'peerDependenciesMeta',
            'optionalDependencies',
            'dependencies',
            'devDependencies',
            'engines',
            'config',
            'overrides',
            'pnpm',
            'husky',
            'lint-staged',
            'eslintConfig',
          ],
        },
        {
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
          order: { type: 'asc' },
        },
      ],
    },
  },
  {
    files: ['**/__tests__/**'],
    rules: {
      'no-console': 'off',
      'vue/one-component-per-file': 'off',
    },
  },
  {
    files: ['docs/examples/**'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.md/*.js', '**/*.md/*.ts'],
    rules: {
      'no-console': 'off',
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  // https://eslint.org/docs/latest/use/configure/ignore#ignoring-files
  // If ignores is used without any other keys in the configuration object, then the patterns act as global ignores.
  {
    ignores: [
      '**/dist',
      'node_modules',
      'pnpm-lock.yaml',
      'CHANGELOG.en-US.md',
      'docs/components.d.ts',
      'coverage',
      'play',
      'ssr-testing/cases/*',
      'docs/.vitepress/i18n/*',
      'docs/.vitepress/cache/*',
      'docs/.vitepress/crowdin/*',
      '**/*.json5',
      '!docs/.vitepress/crowdin/en-US',
      '!.*',
      'build/*.js',
      'src/assets',
      'public',
      'src/api/**/controller/**/*.ts',
      'src/api/**/interface/**/*.ts',
      // 'reqs'
    ],
  }
)