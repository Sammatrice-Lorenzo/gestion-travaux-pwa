import { initializeApp } from 'firebase/app'
import 'https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js'
import 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js'

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: AUTH_DOMAIN_FIREBASE,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET_FIREBASE,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
}

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig)
