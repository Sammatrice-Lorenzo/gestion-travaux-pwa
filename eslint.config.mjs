import pluginJs from '@eslint/js'
import globals from 'globals'

export default [
  {
    files: ['**/src/js/*.js'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  {
    ignorePatterns: ['src/www/**'],
  },
]
