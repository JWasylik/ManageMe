// services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBtPiTdzhRyXPbNwoO0gex6hVv_avb9jek",
    authDomain: "manageme-app.firebaseapp.com",
    projectId: "manageme-app",
    storageBucket: "manageme-app.firebasestorage.app",
    messagingSenderId: "573846651743",
    appId: "1:573846651743:web:dbf023a6478b736e79acea",
    measurementId: "G-R6EY59C83F"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
