const fs = require('node:fs')
const path = require('node:path')
const dotenv = require('dotenv')
dotenv.config()
const sourcePath = path.resolve('src/firebase-messaging-sw.js')
const destPath = path.resolve('public/firebase-messaging-sw.js')

const ENV_LOCAL = path.resolve(__dirname, './.env.local')
const ENV_TEST_LOCAL = path.resolve(__dirname, './.env.test.local')

const envPath = process.env.NODE_ENV === 'test' ? ENV_TEST_LOCAL : ENV_LOCAL

let content = fs.readFileSync(sourcePath, 'utf-8')
const env = dotenv.config({ path: envPath }).parsed || dotenv.config().parsed

const replacements = {
  FIREBASE_API_KEY: env.FIREBASE_API_KEY,
  AUTH_DOMAIN_FIREBASE: env.AUTH_DOMAIN_FIREBASE,
  FIREBASE_DATABASE_URL: env.FIREBASE_DATABASE_URL,
  PROJECT_ID: env.PROJECT_ID,
  STORAGE_BUCKET_FIREBASE: env.STORAGE_BUCKET_FIREBASE,
  MESSAGING_SENDER_ID: env.MESSAGING_SENDER_ID,
  APP_ID: env.APP_ID,
}

for (const [key, value] of Object.entries(replacements)) {
  const regex = new RegExp(key, 'g')

  content = content.replace(regex, JSON.stringify(value))
}

fs.writeFileSync(destPath, content, 'utf-8')

console.info('firebase-messaging-sw.js')
