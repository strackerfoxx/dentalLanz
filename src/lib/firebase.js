// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ9K0BprS8JWKqfiILr_f76rwHeW4371I",
  authDomain: "aera-3c7a2.firebaseapp.com",
  projectId: "aera-3c7a2",
  storageBucket: "aera-3c7a2.firebasestorage.app",
  messagingSenderId: "486481448152",
  appId: "1:486481448152:web:3c0ad6ea0dff5ebd58dbad",
  measurementId: "G-J8X1VZT6PE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);