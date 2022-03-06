import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { IPuzzle } from "../data/IPuzzle";
import { isWord } from '../services/DictionaryService';
import { Guess, LetterResult, processGuess } from '../utils/GameLogicUtils';
import { ValidationMessage } from './ValidationMessage';

interface IProps {
  puzzle: IPuzzle;
}

export function Game(props: IProps): JSX.Element {
  const { register, handleSubmit, reset, setFocus } = useForm();

  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);

  const [guesses, setGuesses] = useState<Guess[]>([]);

  const wordLength: number = props.puzzle.wordToGuess.length;
  const guessesAllowed: number = parseNumber(props.puzzle.numberOfGuesses) ?? 6;
  const guessesLeft: number = guessesAllowed - guesses.length;

  const didWin: boolean = guesses.some(guess => guess.every(guessCell => guessCell.result === LetterResult.green));
  const isGameOver: boolean = didWin || guessesLeft < 1;

  const onSubmitGuess: SubmitHandler<Record<string, any>> = useCallback((data) => {
    setIsWaiting(true);
    setValidationMessage(undefined);
    isWord(data.puzzleGuess)
      .then(isWord => {
        if (isWord) {
          const newGuess: Guess = processGuess(data.puzzleGuess, props.puzzle.wordToGuess);
          setGuesses([...guesses, newGuess]);
          reset();
        } else {
          setValidationMessage(`${data.puzzleGuess} is not a word`);
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
  }, [guesses]);

  return (
    <>
      <div style={{ fontSize: '1.2em' }}>
        { Array(guessesAllowed).fill(1).map((_, rowIndex) => (
          <GuessRow
            key={rowIndex}
            guess={rowIndex < guesses.length ? guesses[rowIndex] : undefined}
            solution={props.puzzle.wordToGuess}
            guessNumber={rowIndex + 1}
          />
        ))}
      </div>
      <br/>
      <br/>
      <form onSubmit={handleSubmit(onSubmitGuess)}>
        <label>
          Guess the {wordLength} letter word, {guessesLeft} {guessesLeft === 1 ? 'guess' : 'guesses'} left:<br/>
          <input disabled={isWaiting} autoComplete='off' maxLength={wordLength} {...register('puzzleGuess', { required: true, minLength: wordLength, maxLength: wordLength, pattern: /^[a-zA-z]*$/ })}></input>
        </label>
        <input disabled={isWaiting || isGameOver} type='submit'/>
        <ValidationMessage message={validationMessage}/>
      </form>
      { isGameOver && (
        <>
          <br/>
          <br/>
          <h2>{didWin ? 'Congrats! You guessed the word' : 'Out of guesses!'}</h2>
          <h3>Share your results:</h3>
          <p>{props.puzzle.title} {guesses.length}/{guessesAllowed}</p>
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