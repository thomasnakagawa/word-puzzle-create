import { useEffect, useState } from "react";
import { IPuzzle } from "../data/IPuzzle";
import { fetchPuzzle } from "../services/PuzzleService";
import { validateAndSanitizePuzzle } from "../utils/PuzzleUtils";

export default function usePuzzle(id?: string): [puzzle?: IPuzzle, error?: string] {
  const [error, setError] = useState<string | undefined>(undefined);
  const [puzzle, setPuzzle] = useState<IPuzzle | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setError('Invalid puzzle id, check the URL');
    } else {
      fetchPuzzle(id)
        .then(validateAndSanitizePuzzle)
        .then(puzzle => {
          if (puzzle) {
            setError(undefined);
            setPuzzle(puzzle);
          } else {
            setError('Puzzle is broken :( You gotta make a new puzzle');
          }
        }).catch((e) => {
          console.error(e);
          setError('Could not get the puzzle, check the URL');
        });
    }
  }, [id]);

  return [puzzle, error];
}
