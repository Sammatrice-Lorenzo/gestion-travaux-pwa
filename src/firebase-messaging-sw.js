importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

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
  if (payload.notification) {
    const notificationTitle = payload.notification.title || 'Notification'
    const notificationOptions = {
      body:
        payload.notification.body ||
        'Vous avez reçu une nouvelle notification.',
      icon: '../public/icons/favicon.png',
      silent: false,
    }

    return self.registration.showNotification(
      notificationTitle,
      notificationOptions,
    )
  }
})
