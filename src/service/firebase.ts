// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDq5JprvYYbbYz6oh1UJprFVLAwUYQcHX0",
  authDomain: "rubino-s.firebaseapp.com",
  projectId: "rubino-s",
  storageBucket: "rubino-s.firebasestorage.app",
  messagingSenderId: "205108900420",
  appId: "1:205108900420:web:ff74bcdcc7aaeba394c211",
  measurementId: "G-2JCV5JC6BF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const functions = getFunctions(app);