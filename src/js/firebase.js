import {} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js'
import {} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js'
import { initializeApp } from "firebase/app"
import { getMessaging } from "firebase/messaging"

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.AUTH_DOMAIN_FIREBASE,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET_FIREBASE,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
}

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig)