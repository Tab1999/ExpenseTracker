// firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqvvVLUwvItKAYIAGjJUhOh1Enr7eDdI4",
  authDomain: "signup-fbdfd.firebaseapp.com",
  databaseURL: "https://signup-fbdfd-default-rtdb.firebaseio.com",
  projectId: "signup-fbdfd",
  storageBucket: "signup-fbdfd.appspot.com",
  messagingSenderId: "489800923589",
  appId: "1:489800923589:web:546415134f0a41507133ac",
  measurementId: "G-8GR2T034LM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
