import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDCCf0FGjrUglh_seicxWXSVsSLjIpoDfo",
    authDomain: "a-pa-56a94.firebaseapp.com",
    projectId: "a-pa-56a94",
    storageBucket: "a-pa-56a94.firebasestorage.app",
    messagingSenderId: "417502338138",
    appId: "1:417502338138:web:97ef80ee007b7e0c990c63",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
