module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@babel/eslint-parser',
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  plugins: ['react', 'react-refresh'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'arrow-parens': 0,
    'comma-dangle': [2, 'never'],
    curly: 0,
    'function-paren-newline': 0,
    'global-require': 0,
    'import/no-extraneous-dependencies': 0,
    indent: 0,
    'no-console': 0,
    'no-mixed-operators': 0,
    'no-return-assign': 0,
    'react/jsx-closing-bracket-location': 0,
    'react/jsx-filename-extension': 0,
  },
};
