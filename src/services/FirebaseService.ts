import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, DocumentReference, doc, Firestore, DocumentSnapshot, addDoc } from 'firebase/firestore/lite';
import { IPuzzle } from "../data/IPuzzle";

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

export async function writePuzzle(puzzle: IPuzzle): Promise<string> {
  const docRef = await addDoc(collection(db, puzzleCollection()), puzzle);
  return docRef.id;
}

export async function fetchPuzzle(puzzleId: string): Promise<IPuzzle> {
  const puzzleReference: DocumentReference = doc(db, puzzleCollection(), puzzleId)
  const documentSnapshot: DocumentSnapshot = await getDoc(puzzleReference);
  if (documentSnapshot.exists()) {
    return documentSnapshot.data() as IPuzzle;
  } else {
    throw new Error('Could not find puzzle');
  }
}

function puzzleCollection(): string {
  switch(process.env.NODE_ENV) {
    case 'test':
      return 'puzzlesTest';
    case 'development':
      return 'puzzlesDev';
    default:
      return 'puzzles';
  }
}
