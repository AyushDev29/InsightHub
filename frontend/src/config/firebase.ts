/**
 * Firebase Configuration
 * Connects the app to Firebase for analytics, hosting, and future features
 */

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCWsFnJBFiLHLFuQQIW_63A9zxNics1RzU',
  authDomain: 'datamind-71f46.firebaseapp.com',
  projectId: 'datamind-71f46',
  storageBucket: 'datamind-71f46.firebasestorage.app',
  messagingSenderId: '261009835350',
  appId: '1:261009835350:web:011dc54faae59a69c902f7',
  measurementId: 'G-R8WGD47F42',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export { app, analytics }
