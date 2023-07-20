const { generateSW } = require('workbox-build');
const fs = require('fs');

const workboxConfig = {
    globDirectory: 'src/www/',
    globPatterns: ['**/*.{woff,woff2,js,css,png,jpg,svg,html}'],
    /* pass array of globs to exclude from caching */
    globIgnores: [],
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
    swDest: 'src/www/service-worker.js',
};

generateSW(workboxConfig)
    .then(({ count, size }) => {
        console.log(`Generated ${workboxConfig.swDest}, which will precache ${count} files, totaling ${size} bytes.`);

        // Inject firebase-messaging-sw.js into the generated service worker
        const firebaseMessagingSWContent = fs.readFileSync('src/firebase-messaging-sw.js', 'utf-8');
        const serviceWorkerContent = fs.readFileSync(workboxConfig.swDest, 'utf-8');
        const updatedServiceWorkerContent = serviceWorkerContent.replace(
            '/* INJECT_FIREBASE_MESSAGING_SW */',
            firebaseMessagingSWContent
        );
        fs.writeFileSync(workboxConfig.swDest, updatedServiceWorkerContent, 'utf-8');

        console.log('Injected firebase-messaging-sw.js into the service worker.');
    })
    .catch((error) => {
        console.log('Error generating service worker:', error);
    });