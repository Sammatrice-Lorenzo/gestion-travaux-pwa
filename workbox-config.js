module.exports = {
  globDirectory: 'src/www/',
  globPatterns: ['**/*.{woff,woff2,js,css,png,jpg,svg,html}'],
  additionalManifestEntries: [
    { url: '/firebase-messaging-sw.js', revision: null },
    { url: './src//css/icons.css', revision: null },
  ],
  /* pass array of globs to exclude from caching */
  globIgnores: [],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  // swDest: 'www/service-worker.js',
  swDest: 'src/www/service-worker.js',
}
