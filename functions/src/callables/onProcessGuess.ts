import { https } from "firebase-functions/v1";
import { isWord } from "../services/dictionaryService";
import { fetchDocument } from "../services/firestoreService";
import { processGuess } from "../utils/gameLogicUtils";
import { ensure } from "../utils/requestUtils";
import { normalizeWord } from "../utils/wordUtils";
import { LetterResult } from "../data/LetterResult";
import { IObfucscatedPuzzle } from "../data/PuzzleTypes";

export interface IRequestData {
  puzzleId?: string;
  guess?: string;
}

export interface IResponseData {
  results?: LetterResult[];
  guessWord: string;
  isNotWord?: true;
}

export default function onProcessGuess(data: IRequestData): Promise<IResponseData> {
  const puzzleId: string = ensure(data, 'puzzleId', 'string');
  const guessValue: string = ensure(data, 'guess', 'string');

  const guessWord: string = normalizeWord(guessValue);
  
  return Promise.all([
    isWord(guessWord),
    fetchDocument(`puzzles/${puzzleId}`)
  ]).then(value => {
    const isWord: boolean = value[0];
    const docData: Object = value[1];

    const nonDictionaryAllowed: boolean = !!((docData as IObfucscatedPuzzle)?.extraRules?.nonDictionaryAllowed);
    if (!isWord && !nonDictionaryAllowed) {
      return {
        guessWord,
        isNotWord: true
      };
    }

    const wordToGuessValue: string = ensure(docData, 'wordToGuess', 'string');
    const wordToGuess: string = normalizeWord(wordToGuessValue);

    if (wordToGuess.length !== guessWord.length) {
      throw new https.HttpsError('invalid-argument', `Guess must be ${wordToGuess.length} letters`);
    }

    const results: LetterResult[] = processGuess(guessWord, wordToGuess);

    return {
      results,
      guessWord
    }
  });
}
