import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqqkfK2ambsf8BybwNeefodM1E02vmEPQ",
  authDomain: "twitter-reloaded-6a53f.firebaseapp.com",
  projectId: "twitter-reloaded-6a53f",
  storageBucket: "twitter-reloaded-6a53f.appspot.com",
  messagingSenderId: "142837181205",
  appId: "1:142837181205:web:8e466d23ee46dc070b571c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
