import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from 'firebase/firestore/lite';
import { Functions, getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyC71-xgjVwkWyI6ldbMKdhoJ5UWvDXLEZc",
  authDomain: "word-puzzle-share.firebaseapp.com",
  projectId: "word-puzzle-share",
  storageBucket: "word-puzzle-share.appspot.com",
  messagingSenderId: "526883455776",
  appId: "1:526883455776:web:31aaadd52c2ba71e1c0d45"
};

const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

export default db;

export function puzzleCollection(): string {
  switch(process.env.NODE_ENV) {
    case 'test':
      return 'puzzlesTest';
    case 'development':
      return 'puzzlesDev';
    default:
      return 'puzzles';
  }
}

export const cloudFunctions: Functions = getFunctions(app);
