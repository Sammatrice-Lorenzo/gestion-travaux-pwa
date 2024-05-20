import path from 'path';
import framework7 from 'rollup-plugin-framework7';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

import https from 'https';
dotenv.config();

const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
// const BUILD_DIR = path.resolve(__dirname, './www',);
const BUILD_DIR = path.resolve(__dirname, './src/www',);
const JWT_DIR = path.resolve(__dirname, './config/jwt/public.pem',);
const KEY_SSL = path.resolve(__dirname, './config/ssl/key.pem',);
const CERT_SSL = path.resolve(__dirname, './config/ssl/cert.pem',);
const ENV_LOCAL = path.resolve(__dirname, './.env.local',);

import fs from 'fs';
const publicKey = fs.readFileSync(JWT_DIR, 'utf8');

const options = {
    key: fs.readFileSync(KEY_SSL, 'utf8'),
    cert: fs.readFileSync(CERT_SSL, 'utf8')
};

const env = dotenv.config({ path: ENV_LOCAL }).parsed || dotenv.config().parsed;
export default async () => {
    return {
        plugins: [
            framework7({ emitCss: false }),
            replace({
                preventAssignment: true,
                values: {
                    'API_URL': JSON.stringify(env.API_URL),
                    'FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY),
                    'AUTH_DOMAIN_FIREBASE': JSON.stringify(env.AUTH_DOMAIN_FIREBASE),
                    'FIREBASE_DATABASE_URL': JSON.stringify(env.FIREBASE_DATABASE_URL),
                    'PROJECT_ID': JSON.stringify(env.PROJECT_ID),
                    'STORAGE_BUCKET_FIREBASE': JSON.stringify(env.STORAGE_BUCKET_FIREBASE),
                    'MESSAGING_SENDER_ID': JSON.stringify(env.MESSAGING_SENDER_ID),
                    'APP_ID': JSON.stringify(env.APP_ID),
                }
            })
        ],
        middleware: [
            (req, res, next) => {
                if (req.url.startsWith('/www/')) {
                    const filePath = path.join(__dirname, 'www', req.url.replace('/www/', ''))
                    res.sendFile(filePath)
                } else {
                    next()
                }
            }
        ],
        root: SRC_DIR,
        base: '/',
        publicDir: PUBLIC_DIR,
        build: {
            outDir: BUILD_DIR,
            assetsInlineLimit: 0,
            emptyOutDir: true,
            rollupOptions: {
                treeshake: false,
            },
            assetsDir: './www'
        },
        resolve: {
            alias: {
                '@': SRC_DIR,
            },
        },
        server: {
            https: https.createServer(options),
            host: true,
            hmr: {
                overlay: true
            },
            proxy: {
                '/api': {
                    target: env.API_URL,
                    changeOrigin: true,
                    cors: true
                }
            }
        },
        esbuild: {
            jsxFactory: '$jsx',
            jsxFragment: '"Fragment"',
        },
        define: {
            'process.env': {
                JWT_PUBLIC_KEY: publicKey,
                VAPID_KEY: env.VAPID_KEY,
            }
        },
        copy: {
            targets: [
                {
                    src: 'src/service-worker.js',
                    dest: './www',
                },
            ],
        },
    };
};
