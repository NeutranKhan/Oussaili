import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6A8ZF8tIh3agqelkT0FjS_khkFAg6hLs",
  authDomain: "liborder-99745.firebaseapp.com",
  projectId: "liborder-99745",
  storageBucket: "liborder-99745.firebasestorage.app",
  messagingSenderId: "526450011559",
  appId: "1:526450011559:web:5c1a6925de52ca21d09a82",
  measurementId: "G-PHX5SK4NQC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
