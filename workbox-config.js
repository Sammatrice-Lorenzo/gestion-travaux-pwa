module.exports = {
  globDirectory: 'www/',
  globPatterns: ['**/*.{woff,woff2,js,css,png,jpg,svg,html}'],
  globIgnores: [],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'www/service-worker.js',
  additionalManifestEntries: [
    { url: 'src/firebase-messaging-sw.js', revision: null },
  ],
  clientsClaim: true,
  skipWaiting: true,
}
