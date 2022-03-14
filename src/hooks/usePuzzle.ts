import { useEffect, useState } from "react";
import { IObfucscatedPuzzle } from "../data/PuzzleTypes";
import { fetchPuzzlePrompt } from "../services/fetchPuzzlePromptService";

export default function usePuzzle(id?: string): [puzzle?: IObfucscatedPuzzle, error?: string] {
  const [error, setError] = useState<string | undefined>(undefined);
  const [puzzle, setPuzzle] = useState<IObfucscatedPuzzle | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setError('Invalid puzzle id, check the URL');
    } else {
      fetchPuzzlePrompt({ puzzleId: id })
        .then(data => {
          const puzzle: IObfucscatedPuzzle = data.puzzle;
          if (puzzle) {
            setError(undefined);
            setPuzzle(puzzle);
          } else {
            setError('Puzzle is broken :( You gotta make a new puzzle');
            setPuzzle(undefined);
          }
        })
        .catch(e => {
          console.error(e);
          setError('Error fetching');
          setPuzzle(undefined);
        })
    }
  }, [id]);

  return [puzzle, error];
}
