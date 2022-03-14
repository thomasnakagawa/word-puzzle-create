import { useCallback, useEffect, useState } from "react";
import { Guess } from "../data/Guess";

export interface IGuesses {
  guesses: Guess[];
  addGuess: (guess: Guess) => void;
}

export default function useGuesses(puzzleId: string): IGuesses {
  const storageKey: string = `game${puzzleId}`;

  const [guesses, setGuesses] = useState<Guess[]>(() => {
    const storedValue: string | null = localStorage.getItem(storageKey);
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch(e) {
        localStorage.removeItem(storageKey);
        return [];
      }
    }
    return [];
  });

  useEffect(
    () => {
      localStorage.setItem(storageKey, JSON.stringify(guesses));
    },
    [storageKey, guesses]
  );

  const addGuess = useCallback(
    (newGuess: Guess) => {
      setGuesses([...guesses, newGuess]);
    },
    [guesses]
  );

  return { guesses, addGuess };
}
