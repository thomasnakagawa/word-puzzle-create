import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { VALID_WORD_PATTERN } from '../constants/regex';
import { strings } from '../constants/strings';
import { values } from '../constants/values';
import { Guess, LetterResult } from '../data/Guess';
import { IPuzzle } from "../data/IPuzzle";
import { useTitle } from '../hooks/useTitle';
import { processGuess } from '../utils/GameLogicUtils';
import { validateAndSanitizeWord } from '../utils/WordUtils';
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

  const solutionWord: string = props.puzzle.wordToGuess.toLowerCase();
  const wordLength: number = solutionWord.length;
  const guessesAllowed: number = parseNumber(props.puzzle.numberOfGuesses) ?? values.DEFAULT_NUMBER_OF_GUESSES_ALLOWED;
  const guessesLeft: number = guessesAllowed - guesses.length;

  const didWin: boolean = guesses.some(guess => guess.every(guessCell => guessCell.result === LetterResult.green));
  const isGameOver: boolean = didWin || guessesLeft < 1;

  const onSubmitGuess: SubmitHandler<Record<string, any>> = useCallback((data) => {
    const guessedWord: string = data.puzzleGuess.toLowerCase();
    setIsWaiting(true);
    setValidationMessage(undefined);

    validateAndSanitizeWord(guessedWord)
      .then(word => {
        if (word) {
          const newGuess: Guess = processGuess(word, solutionWord);
          setGuesses([...guesses, newGuess]);
          reset();
        } else {
          setValidationMessage(`${guessedWord} is not a word`);
        }
      })
      .catch((e) => {
        console.error(e);
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
            solution={solutionWord}
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
      { isGameOver && (
        <>
          <br/>
          <br/>
          <h2>{didWin ? 'Congrats! You guessed the word' : `Out of guesses! The word is "${solutionWord}"`}</h2>
          <h3>Share your results:</h3>
          <p>{puzzleTitle} {guesses.length}/{guessesAllowed}</p>
          { guesses.map((guess, guessIndex) => (
            <>
              <span key={`guess-row-${guessIndex}`}>
                { guess.map((guessCell, guessCellIndex) => (
                  <span key={`guess-cell-${guessIndex}-${guessCellIndex}`}>
                    { resultEmoji(guessCell.result) }
                  </span>
                ))}
              </span>
              <br/>
            </>
          ))}
          <p>{window.location.toString()}</p>
          <br/>
          <p><Link to='/'>Create your own word puzzle </Link></p>
        </>
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

interface IGuessRowProps {
  solution: string;
  guess?: Guess;
  guessNumber: number;
}

function GuessRow(props: IGuessRowProps): JSX.Element {
  if (props.guess) {
    return (
      <div>
        <span>{props.guessNumber}: </span>
        { props.guess.map((guessCell, index) => (
          <span key={index} style={letterStyle(guessCell.result)}>{guessCell.letter} </span>
        ))}
      </div>
    );
  } else {
    return (
      <div>
        <span>{props.guessNumber}: {'_ '.repeat(props.solution.length)}</span>
      </div>
    )
  }
}

function letterStyle(letterResult: LetterResult): React.CSSProperties {
  switch(letterResult) {
    case LetterResult.gray:
      return {
        backgroundColor: 'lightgray'
      }
    case LetterResult.yellow: 
      return {
        backgroundColor: 'yellow'
      }
    case LetterResult.green: 
      return {
        backgroundColor: 'lime'
      }
  }
}

function resultEmoji(letterResult: LetterResult): string {
  switch(letterResult) {
    case LetterResult.gray:
      return '⬛';
    case LetterResult.yellow: 
      return '🟨';
    case LetterResult.green: 
      return '🟩';
  }
}