import { LetterResult } from "../data/LetterResult";

export function processGuess(guessString: string, solution: string): LetterResult[] {
  const processedGuess: LetterResult[] = guessString.split('').map(guessLetter => (LetterResult.gray));

  // set the green letters 
  solution.split('').forEach((solutionLetter, index) => {
    if (solutionLetter === guessString.charAt(index)) {
      processedGuess[index] = LetterResult.green;
    }
  })

  // set the yellow letters
  const solutionLetterOccurances: Map<string, number> = new Map();
  solution.split('').forEach((solutionLetter, letterIndex) => {
    if (processedGuess[letterIndex] === LetterResult.gray) {
      solutionLetterOccurances.set(solutionLetter, (solutionLetterOccurances.get(solutionLetter) || 0) + 1);
    }
  });
  
  guessString.split('').forEach((guessLetter, letterIndex) => {
    if (processedGuess[letterIndex] === LetterResult.gray && (solutionLetterOccurances.get(guessLetter) || 0) > 0) {
      processedGuess[letterIndex] = LetterResult.yellow;
      solutionLetterOccurances.set(guessLetter, (solutionLetterOccurances.get(guessLetter) || 0) - 1);
    }
  });

  return processedGuess;
}
