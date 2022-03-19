import { https } from 'firebase-functions/v1';
import { ICompletePuzzle } from '../data/PuzzleTypes';
import { isWord } from '../services/dictionaryService';
import { writeDocument } from '../services/firestoreService';
import { ensure } from '../utils/requestUtils';
import { normalizeWord } from '../utils/wordUtils';

export interface IRequestData {
  puzzle: ICompletePuzzle;
}

export interface IResponseData {
  puzzleId: string;
}

export default function onWritePuzzle(data: IRequestData): Promise<IResponseData> {
  const puzzle: ICompletePuzzle = ensure(data, 'puzzle', 'object');

  const wordToGuess: string = ensure(puzzle, 'wordToGuess', 'string');
  const solutionWordValue: string = normalizeWord(wordToGuess);
  const nonDictionaryAllowed: boolean = !!puzzle.extraRules?.nonDictionaryAllowed;

  return isWord(solutionWordValue)
    .then(isWord => {
      if (!isWord && !nonDictionaryAllowed) {
        throw new https.HttpsError('invalid-argument', `${solutionWordValue} is not a word`);
      }
    })
    .then(() => {
      const documentData: ICompletePuzzle = {
        wordToGuess: solutionWordValue
      };

      if (puzzle.title) {
        if (typeof puzzle.title !== 'string') {
          throw new https.HttpsError('invalid-argument', 'Title must be a string');
        }
        documentData.title = puzzle.title;
      }

      if (puzzle.numberOfGuesses) {
        if (typeof puzzle.numberOfGuesses !== 'number' || puzzle.numberOfGuesses > 100 || puzzle.numberOfGuesses < 1) {
          throw new https.HttpsError('invalid-argument', 'Invalid numberOfGuesses');
        }
        documentData.numberOfGuesses = puzzle.numberOfGuesses;
      }

      if (puzzle.extraRules) {
        if (typeof puzzle.extraRules !== 'object') {
          throw new https.HttpsError('invalid-argument', 'extraRules must be an object');
        }
        documentData.extraRules = puzzle.extraRules;
      }

      return writeDocument('puzzles', documentData)
    })
    .then(documentId => {
      return {
        puzzleId: documentId
      }
    });
}
