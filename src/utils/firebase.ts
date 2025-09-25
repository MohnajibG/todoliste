// src/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoXoklbXvw3Fr5EOD4NnO9vAhjtqsIgUg",
  authDomain: "todo-db2d4.firebaseapp.com",
  projectId: "todo-db2d4",
  storageBucket: "todo-db2d4.firebasestorage.app",
  messagingSenderId: "313631889743",
  appId: "1:313631889743:web:883e3031d0b7a0090ecd3a",
  measurementId: "G-5Q2HXWDW39",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Providers (clairement nommés)
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider(); // optionnel si tu veux GitHub

// Méthodes
export { signInWithPopup, signOut };
