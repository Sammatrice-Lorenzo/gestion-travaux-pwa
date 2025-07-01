importScripts(
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
)
importScripts(
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js',
)

const configFirebase = {
  apiKey: FIREBASE_API_KEY,
  authDomain: AUTH_DOMAIN_FIREBASE,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET_FIREBASE,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
}

firebase.initializeApp(configFirebase)

const messaging = firebase.messaging()
messaging.onBackgroundMessage((payload) => {
  console.info(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  )

  const notificationTitle = payload.notification?.title || 'Notification'
  const notificationOptions = {
    body: payload.notification?.body || 'Vous avez reçu une notification.',
    icon: '/icons/favicon.png',
  }

  // self.registration.showNotification(notificationTitle, notificationOptions)
})
