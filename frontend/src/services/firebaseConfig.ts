import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth} from 'firebase/auth';
const { getReactNativePersistence } = require('firebase/auth');

// Replace this with your actual keys from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDgQ8kzdeDppxck4dpOD01fRh_3YsKzVDE",
  authDomain: "surflog-23a00.firebaseapp.com",
  projectId: "surflog-23a00",
  storageBucket: "surflog-23a00.firebasestorage.app",
  messagingSenderId: "221212645072",
  appId: "1:221212645072:web:96fb1756bd5b0a816670d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage so users don't have to log in every time they open the app
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});