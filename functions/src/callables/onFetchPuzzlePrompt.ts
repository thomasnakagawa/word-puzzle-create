import { fetchDocument } from "../services/firestoreService";
import { ensure } from "../utils/requestUtils";
import { IObfucscatedPuzzle } from "../data/PuzzleTypes";

export interface IRequestData {
  puzzleId: string;
}

export interface IResponseData {
  puzzle: IObfucscatedPuzzle;
}

export default function onFetchPuzzlePrompt(data: IRequestData): Promise<IResponseData> {
  const puzzleId: string = ensure(data, 'puzzleId', 'string');
  return fetchDocument(`puzzles/${puzzleId}`).then(responseData => {
    const puzzle: IObfucscatedPuzzle = {
      numberOfGuesses: ensure(responseData, 'numberOfGuesses', 'number'),
      solutionNumberOfLetters: (ensure(responseData, 'wordToGuess', 'string') as string).length,
      title: (responseData as IObfucscatedPuzzle).title
    };

    return {
      puzzle
    };
  });
}
