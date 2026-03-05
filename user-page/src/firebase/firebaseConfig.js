// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔹 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2KVhUbYSJvRVhLkWn9JH7z1mhNlpz_Eo",
  authDomain: "electricity-billing-app-fd945.firebaseapp.com",
  projectId: "electricity-billing-app-fd945",
  storageBucket: "electricity-billing-app-fd945.firebasestorage.app",
  messagingSenderId: "362898740002",
  appId: "1:362898740002:web:6c9ab84a97a94547404b7b"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Initialize Firestore
const db = getFirestore(app);

// 🔹 EXPORT db (THIS WAS MISSING / WRONG)
export { db };
