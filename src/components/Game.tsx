import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { VALID_WORD_PATTERN } from '../constants/regex';
import { strings } from '../constants/strings';
import { values } from '../constants/values';
import { Guess, LetterResult } from '../data/Guess';
import { IObfucscatedPuzzle } from '../data/PuzzleTypes';
import useGuesses from '../hooks/useGuesses';
import { useTitle } from '../hooks/useTitle';
import { processGuess } from '../services/processGuessService';
import GuessRow from './GuessRow';
import Keyboard from './Keyboard';
import Results from './Results';
import ValidationMessage from './uiElements/ValidationMessage';

interface IProps {
  puzzle: IObfucscatedPuzzle;
  puzzleId: string;
}

export default function Game(props: IProps): JSX.Element {
  const puzzleTitle: string = (props.puzzle.title && props.puzzle.title.length > 0) ? props.puzzle.title : strings.DEFAULT_PUZZLE_TITLE;
  useTitle(puzzleTitle);

  const { register, handleSubmit, reset, setFocus, setValue, getValues } = useForm();

  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);

  const { guesses, addGuess } = useGuesses(props.puzzleId);

  const wordLength: number = props.puzzle.solutionNumberOfLetters;
  const guessesAllowed: number = parseNumber(props.puzzle.numberOfGuesses) ?? values.DEFAULT_NUMBER_OF_GUESSES_ALLOWED;  
  const guessesLeft: number = guessesAllowed - guesses.length;

  const didWin: boolean = guesses.some(guess => guess.every(guessCell => guessCell.result === LetterResult.green));
  const isGameOver: boolean = didWin || guessesLeft < 1;

  const onSubmitGuess: SubmitHandler<Record<string, any>> = useCallback((data) => {
    setIsWaiting(true);
    setValidationMessage(undefined);

    processGuess({ puzzleId: props.puzzleId, guess: data.puzzleGuess })
      .then(response => {
        if (response.isNotWord) {
          setValidationMessage(`${data.puzzleGuess} is not a word`);
          return;
        }

        if (!response.results) {
          setValidationMessage('Invalid result');
          return;
        }

        const newGuess: Guess = response.results.map(
          (letterResult, index) => ({
            result: letterResult,
            letter: response.guessWord.charAt(index)
          })
        );
        addGuess(newGuess);
        reset();
      })
      .catch((e) => {
        setValidationMessage('there was an error');
      })
      .finally(() => {
        setIsWaiting(false);
        setFocus('puzzleGuess')
      })
  }, [props.puzzleId, addGuess, reset, setFocus]);

  const onBackspace: () => void = useCallback(
    () => {
      const guessValue: string = getValues('puzzleGuess') || '';
      const updatedGuess: string = guessValue.substring(0, guessValue.length - 1);
      setValue(
        'puzzleGuess',
        updatedGuess,
        { shouldValidate: true }
      );
    },
    [getValues, setValue]
  );

  const onKeyClicked: (key: string) => void = useCallback(
    (key) => {
      const guessValue: string = getValues('puzzleGuess') || '';
      if (guessValue.length < wordLength) {
        setValue(
          'puzzleGuess',
          `${guessValue}${key}`,
          { shouldValidate: true }
        );
      }
    },
    [getValues, setValue, wordLength]
  );

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
          <input
            disabled={isWaiting}
            autoComplete='off'
            maxLength={wordLength} 
            {...register('puzzleGuess', {
              required: true,
              minLength: wordLength,
              maxLength: wordLength, 
              pattern: VALID_WORD_PATTERN
            })}
          ></input>
        </label>
        <input disabled={isWaiting || isGameOver} type='submit'/>
        <ValidationMessage message={validationMessage}/>
      </form>
      {isGameOver && (
        <Results
          puzzleTitle={puzzleTitle}
          didWin={didWin}
          solutionWord={'TODO: solution word?'}
          guesses={guesses}
          guessesAllowed={guessesAllowed}
        />
      )}
      {isGameOver || (
        <Keyboard
          guesses={guesses}
          onKeyClicked={onKeyClicked}
          onBackspace={onBackspace}
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
