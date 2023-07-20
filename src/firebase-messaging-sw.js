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
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '../public/icons/favicon.png',
        silent: false, 
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
})
