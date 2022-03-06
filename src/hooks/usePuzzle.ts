import { useEffect, useState } from "react";
import { IPuzzle } from "../data/IPuzzle";
import { isWord } from "../services/DictionaryService";
import { fetchPuzzle } from "../services/FirebaseService";

export default function usePuzzle(id?: string): [puzzle?: IPuzzle, error?: string] {
  const [error, setError] = useState<string | undefined>(undefined);
  const [puzzle, setPuzzle] = useState<IPuzzle | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setError('Invalid puzzle id, check the URL');
    } else {
      fetchPuzzle(id).then((puzzle) => {
        return isWord(puzzle.wordToGuess)
          .then(isWord => {
            if (isWord) {
              setError(undefined);
              setPuzzle(puzzle);
            } else {
              setError('Puzzle is broken :( You gotta make a new puzzle');
            }
          })
      }).catch((e) => {
        console.error(e);
        setError('Could not get the puzzle, check the URL');
      });
    }
  }, [id]);

  return [puzzle, error];
}

function processAndValidatePuzzle(puzzle: IPuzzle): Promise<IPuzzle> {
  const puzzleCopy: IPuzzle = {...puzzle};
  
  if (!puzzleCopy.wordToGuess || puzzleCopy.wordToGuess.length < 1)

  puzzleCopy.wordToGuess = puzzleCopy.wordToGuess.toLowerCase();
  puzzleCopy.numberOfGuesses = parseNumber(puzzleCopy.numberOfGuesses);

  return isWord(puzzle.wordToGuess)
    .then(isWord => {
      if (isWord) {
        return puzzleCopy;
      } else {
        throw new Error('Invalid puzzle');
      }
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