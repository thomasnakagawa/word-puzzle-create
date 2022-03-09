import { Guess, LetterResult } from "../data/Guess";

export function processGuess(guessString: string, solution: string): Guess {
  const processedGuess: Guess = guessString.split('').map(guessLetter => ({ letter: guessLetter, result: LetterResult.gray }));

  // set the green letters 
  solution.split('').forEach((solutionLetter, index) => {
    if (solutionLetter === guessString.charAt(index)) {
      processedGuess[index].result = LetterResult.green;
    }
  })

  // set the yellow letters
  const solutionLetterOccurances: Map<string, number> = new Map();
  solution.split('').forEach((solutionLetter, letterIndex) => {
    if (processedGuess[letterIndex].result === LetterResult.gray) {
      solutionLetterOccurances.set(solutionLetter, (solutionLetterOccurances.get(solutionLetter) || 0) + 1);
    }
  });
  
  guessString.split('').forEach((guessLetter, letterIndex) => {
    if (processedGuess[letterIndex].result === LetterResult.gray && (solutionLetterOccurances.get(guessLetter) || 0) > 0) {
      processedGuess[letterIndex].result = LetterResult.yellow;
      solutionLetterOccurances.set(guessLetter, (solutionLetterOccurances.get(guessLetter) || 0) - 1);
    }
  });

  return processedGuess;
}