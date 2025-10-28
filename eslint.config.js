const eslintPluginTs = require('@typescript-eslint/eslint-plugin');
const eslintParserTs = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['jest.config.js', 'cdk.out/', 'node_modules/'], // ← ここで除外
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: eslintParserTs,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];;