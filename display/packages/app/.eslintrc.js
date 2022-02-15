module.exports = {
  env: {
    node: true,
  },
  plugins: [
    'vue',
  ],
  extends: [
    'plugin:vue/recommended',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      'registeredComponentsOnly': false,
      'ignores': [],
    } ],
    'vue/no-boolean-default': 'error',
    'vue/no-child-content': 'error',
    'vue/no-this-in-before-route-enter': 'error',
    'vue/v-on-function-call': 'error',
  },
}
