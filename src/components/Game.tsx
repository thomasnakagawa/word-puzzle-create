import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { VALID_WORD_PATTERN } from '../constants/regex';
import { strings } from '../constants/strings';
import { values } from '../constants/values';
import { Guess, LetterResult } from '../data/Guess';
import { IPuzzle } from "../data/IPuzzle";
import { useTitle } from '../hooks/useTitle';
import { processGuess } from '../utils/GameLogicUtils';
import { normalizeWord, validateAndSanitizeWord } from '../utils/WordUtils';
import GuessRow from './GuessRow';
import Results from './Results';
import ValidationMessage from './uiElements/ValidationMessage';

interface IProps {
  puzzle: IPuzzle;
}

export default function Game(props: IProps): JSX.Element {
  const puzzleTitle: string = (props.puzzle.title && props.puzzle.title.length > 0) ? props.puzzle.title : strings.DEFAULT_PUZZLE_TITLE;
  useTitle(puzzleTitle);

  const { register, handleSubmit, reset, setFocus } = useForm();

  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);

  const [guesses, setGuesses] = useState<Guess[]>([]);

  const solutionWord: string = normalizeWord(props.puzzle.wordToGuess);
  const wordLength: number = solutionWord.length;
  const guessesAllowed: number = parseNumber(props.puzzle.numberOfGuesses) ?? values.DEFAULT_NUMBER_OF_GUESSES_ALLOWED;
  const guessesLeft: number = guessesAllowed - guesses.length;

  const didWin: boolean = guesses.some(guess => guess.every(guessCell => guessCell.result === LetterResult.green));
  const isGameOver: boolean = didWin || guessesLeft < 1;

  const onSubmitGuess: SubmitHandler<Record<string, any>> = useCallback((data) => {
    setIsWaiting(true);
    setValidationMessage(undefined);

    validateAndSanitizeWord(data.puzzleGuess)
      .then(word => {
        if (word) {
          const newGuess: Guess = processGuess(word, solutionWord);
          setGuesses([...guesses, newGuess]);
          reset();
        } else {
          setValidationMessage(`${data.puzzleGuess} is not a word`);
        }
      })
      .catch((e) => {
        setValidationMessage('there was an error');
      })
      .finally(() => {
        setIsWaiting(false);
        setFocus('puzzleGuess')
      })
  }, [guesses, solutionWord, reset, setFocus]);

  return (
    <>
      <h1>{puzzleTitle}</h1>
      <h2>Guess the word!</h2>
      <div style={{ fontSize: '1.2em' }}>
        { Array(guessesAllowed).fill(1).map((_, rowIndex) => (
          <GuessRow
            key={rowIndex}
            guess={rowIndex < guesses.length ? guesses[rowIndex] : undefined}
            solutionLength={wordLength}
            guessNumber={rowIndex + 1}
          />
        ))}
      </div>
      <br/>
      <br/>
      <form onSubmit={handleSubmit(onSubmitGuess)}>
        <label>
          Guess the {wordLength} letter word, {guessesLeft} {guessesLeft === 1 ? 'guess' : 'guesses'} left:<br/>
          <input disabled={isWaiting} autoComplete='off' maxLength={wordLength} {...register('puzzleGuess', { required: true, minLength: wordLength, maxLength: wordLength, pattern: VALID_WORD_PATTERN })}></input>
        </label>
        <input disabled={isWaiting || isGameOver} type='submit'/>
        <ValidationMessage message={validationMessage}/>
      </form>
      {isGameOver && (
        <Results
          puzzleTitle={puzzleTitle}
          didWin={didWin}
          solutionWord={solutionWord}
          guesses={guesses}
          guessesAllowed={guessesAllowed}
        />
      )}
    </>
  );
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
