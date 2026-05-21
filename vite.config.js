import fs from 'node:fs'
import path from 'node:path'
import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv'
import framework7 from 'rollup-plugin-framework7'
import { VitePWA } from 'vite-plugin-pwa'
dotenv.config()

const SRC_DIR = path.resolve(__dirname, './src')
const PUBLIC_DIR = path.resolve(__dirname, './public')
const BUILD_DIR = path.resolve(__dirname, './www')
const JWT_DIR = path.resolve(__dirname, './config/jwt/public.pem')
const ENV_LOCAL = path.resolve(__dirname, './.env.local')
const ENV_TEST_LOCAL = path.resolve(__dirname, './.env.test.local')

const envPath = process.env.NODE_ENV === 'test' ? ENV_TEST_LOCAL : ENV_LOCAL
const publicKey = fs.readFileSync(JWT_DIR, 'utf8')
const env = dotenv.config({ path: envPath }).parsed || dotenv.config().parsed

const optionsServer = {
  host: true,
  port: 5173,
  hmr: {
    overlay: true,
  },
  proxy: {
    '/api': {
      target: env.API_URL,
      changeOrigin: true,
      cors: true,
    },
  },
}

export default async () => {
  return {
    plugins: [
      framework7({ emitCss: false }),
      replace({
        preventAssignment: true,
        values: {
          API_URL: JSON.stringify(env.API_URL),
          FIREBASE_API_KEY: JSON.stringify(env.FIREBASE_API_KEY),
          AUTH_DOMAIN_FIREBASE: JSON.stringify(env.AUTH_DOMAIN_FIREBASE),
          FIREBASE_DATABASE_URL: JSON.stringify(env.FIREBASE_DATABASE_URL),
          PROJECT_ID: JSON.stringify(env.PROJECT_ID),
          STORAGE_BUCKET_FIREBASE: JSON.stringify(env.STORAGE_BUCKET_FIREBASE),
          MESSAGING_SENDER_ID: JSON.stringify(env.MESSAGING_SENDER_ID),
          APP_ID: JSON.stringify(env.APP_ID),
        },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
        },
      }),
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
      assetsDir: './www',
    },
    resolve: {
      alias: {
        '@': SRC_DIR,
      },
    },
    server: optionsServer,
    esbuild: {
      jsxFactory: '$jsx',
      jsxFragment: '"Fragment"',
    },
    define: {
      'process.env': {
        JWT_PUBLIC_KEY: publicKey,
        VAPID_KEY: env.VAPID_KEY,
        APP_VERSION: env.APP_VERSION,
      },
    },
  }
}
