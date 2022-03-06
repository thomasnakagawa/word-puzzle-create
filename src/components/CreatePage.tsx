import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { isWord } from '../services/DictionaryService';
import { writePuzzle } from '../services/FirebaseService';
import { ValidationMessage } from './ValidationMessage';

export default function CreatePage(): JSX.Element {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);

  const [puzzleId, setPuzzleId] = useState<string | undefined>(undefined);

  const onSubmit: SubmitHandler<Record<string, any>> = useCallback((data) => {
    setIsLoading(true);
    setValidationMessage(undefined);

    isWord(data.puzzleWord)
      .then(isWord => {
        if (!isWord) {
          throw new Error(`${data.puzzleWord} is not a word`)
        }
        return writePuzzle({
          title: data.title,
          wordToGuess: data.puzzleWord,
          numberOfGuesses: data.numberOfGuesses
        });
      })
      .then((puzzleId) => {
        console.log(puzzleId);
        setPuzzleId(puzzleId);
      })
      .catch((e: Error) => {
        setValidationMessage(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      })
    console.log(data);
  }, []);

  const onInvalid = console.error;

  if (puzzleId) {
    const url: string = `${new URL(window.location.toString()).origin}/#/puzzle/${puzzleId}`;
    return (
      <>
        <p>Use this link to share your word puzzle:</p>
        <p>{url}</p>
        <Link to={`/puzzle/${puzzleId}`}>Click here to go to your puzzle</Link>
      </>
    );
  }

  return (
    <>
      <h1>Create a word puzzle</h1>
      <Link to='/'>Back</Link>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <label>
          Puzzle name
          <input autoComplete='off' defaultValue='A word puzzle just for you' style={{width: '250px' }} {...register('title', { required: false, minLength: 1, maxLength: 100 })}/>
        </label>
        <br/>
        <label>
          The word to guess
          <input autoComplete='off' maxLength={12} {...register('puzzleWord', { required: true, minLength: 1, maxLength: 12, pattern: /^[a-zA-z]*$/ })}/>
        </label>
        <br/>
        <label>   
          Number of guesses
          <input type='number' defaultValue={6} min={1} max={100} {...register('numberOfGuesses', { required: true, min: 1, max: 100 })}/>
        </label>
        <br/>
        <input disabled={isLoading} type='submit' value='create'/>
        <ValidationMessage message={validationMessage}/>
      </form>
    </>
  );
}