module.exports = {
  globDirectory: 'src/www/',
  globPatterns: ['**/*.{woff,woff2,js,css,png,jpg,svg,html}'],
  /* pass array of globs to exclude from caching */
  globIgnores: [],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  // swDest: 'www/service-worker.js',
  swDest: 'src/www/service-worker.js',
};
