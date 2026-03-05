// Firebase core
import { initializeApp } from "firebase/app";

// Firebase services we actually use
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ❌ DO NOT use analytics in Vite/localhost
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA2KVhUbYSJvRVhLkWn9JH7z1mhNlpz_Eo",
  authDomain: "electricity-billing-app-fd945.firebaseapp.com",
  projectId: "electricity-billing-app-fd945",
  storageBucket: "electricity-billing-app-fd945.appspot.com",
  messagingSenderId: "362898740002",
  appId: "1:362898740002:web:6c9ab84a97a94547404b7b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT THESE (CRITICAL)
export const auth = getAuth(app);
export const db = getFirestore(app);
