module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'indent': ['error', 4, { 'SwitchCase': 1 }],
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-return-await': ['off']
  },
  globals: {
    "workbox": true,
    "importScripts": true
  }
}
