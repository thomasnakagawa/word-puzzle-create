export interface IBasePuzzle {
  title?: string;
  numberOfGuesses?: number;
}

export interface ICompletePuzzle extends IBasePuzzle {
  solutionWord: string;
}

export interface IObfucscatedPuzzle extends IBasePuzzle {
  solutionNumberOfLetters: number;
}
