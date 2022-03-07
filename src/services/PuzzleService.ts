import { collection, getDoc, DocumentReference, doc, DocumentSnapshot, addDoc } from 'firebase/firestore/lite';
import { IPuzzle } from "../data/IPuzzle";
import db, { puzzleCollection } from '../db/Firebase';

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
