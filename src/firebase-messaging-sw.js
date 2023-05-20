importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: 'AIzaSyA2-w6ZhUPfM5b8kKmi_8g5NbCFZYil-3U',
    authDomain: 'gestion-travaux-pwa-84639.firebaseapp.com',
    databaseURL: 'https://project-id.firebaseio.com',
    projectId: '"gestion-travaux-pwa-84639',
    storageBucket: 'project-id.appspot.com',
    messagingSenderId: '145265878474',
    appId: '1:145265878474:web:1c58ffc43958478d33db33',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '../public/icons/favicon.png',
        silent: false, 
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
