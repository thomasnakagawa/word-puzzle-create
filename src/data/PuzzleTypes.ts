export interface IExtraRules {
  nonDictionaryAllowed?: boolean;
}

export interface IBasePuzzle {
  title?: string;
  numberOfGuesses?: number;
  extraRules?: IExtraRules;
}

export interface ICompletePuzzle extends IBasePuzzle {
  wordToGuess: string;
}

export interface IObfucscatedPuzzle extends IBasePuzzle {
  solutionNumberOfLetters: number;
}
