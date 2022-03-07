import { addDoc, collection, deleteDoc, doc, DocumentReference, DocumentSnapshot, getDoc, setDoc, updateDoc } from 'firebase/firestore/lite';
import { IPuzzle } from '../data/IPuzzle';
import db, { puzzleCollection } from './Firebase';

// these tests write to the db, enable them when editing db rules
xdescribe('Firebase', () => {
  const createTestPuzzle: () => IPuzzle = () => ({ wordToGuess: 'test_word' });
  let createdDocument: DocumentReference | undefined = undefined;

  beforeAll(async () => {
    // write
    const addedDoc: DocumentReference = await addDoc(collection(db, puzzleCollection()), createTestPuzzle());
    createdDocument = addedDoc;
  });

  it('can write then read the puzzle', async () => {
    // read
    const documentSnapshot: DocumentSnapshot = await getDoc(doc(db, puzzleCollection(), createdDocument!.id));
    expect(documentSnapshot.exists()).toBeTruthy();
    expect(documentSnapshot.data()).toEqual(createTestPuzzle());
  });

  test('cannot update the puzzle', async () => {
    expect.assertions(1);
    try {
      await setDoc(doc(db, puzzleCollection(), createdDocument!.id), { wordToGuess: 'updated!' });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test('cannot delete the puzzle', async () => {
    expect.assertions(1);
    try {
      await deleteDoc(doc(db, puzzleCollection(), createdDocument!.id));
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
