import { IPuzzle } from "../data/IPuzzle";
import { validateAndSanitizeWord } from "./WordUtils";

export function validateAndSanitizePuzzle(puzzle: IPuzzle): Promise<IPuzzle | undefined> { 
  if (!puzzle || !puzzle.wordToGuess || typeof puzzle.wordToGuess !== 'string' || puzzle.wordToGuess.length < 1) {
    return Promise.resolve(undefined);
  }
  
  const puzzleCopy: IPuzzle = {...puzzle};
  puzzleCopy.numberOfGuesses = parseNumber(puzzleCopy.numberOfGuesses);

  return validateAndSanitizeWord(puzzleCopy.wordToGuess).then(word => {
    if (!word) {
      return undefined;
    }
    puzzleCopy.wordToGuess = word;
    return puzzleCopy;
  });
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed: number = parseInt(value, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}
