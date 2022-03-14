export interface IBasePuzzle {
  title?: string;
  numberOfGuesses?: number;
}

export interface ICompletePuzzle extends IBasePuzzle {
  wordToGuess: string;
}

export interface IObfucscatedPuzzle extends IBasePuzzle {
  solutionNumberOfLetters: number;
}
