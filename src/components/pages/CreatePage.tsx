import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { VALID_WORD_PATTERN } from '../../constants/regex';
import { strings } from '../../constants/strings';
import { values } from '../../constants/values';
import { writePuzzle } from '../../services/writePuzzleService';
import ValidationMessage from '../uiElements/ValidationMessage';

export default function CreatePage(): JSX.Element {
  const { register, handleSubmit } = useForm();
  const navigate: NavigateFunction = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);

  const onSubmit: SubmitHandler<Record<string, any>> = useCallback((data) => {
    setIsLoading(true);
    setValidationMessage(undefined);

    writePuzzle({
      puzzle: {
        title: data.title,
        wordToGuess: data.puzzleWord,
        numberOfGuesses: Number.parseInt(data.numberOfGuesses, 10)
      }
    })
      .then(response => {
        const puzzleId: string = response.puzzleId;
        navigate(`/create/${puzzleId}`);
      })
      .catch((e: Error) => {
        setValidationMessage(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  const onInvalid = console.error;

  return (
    <>
      <h1>Create a word puzzle</h1>
      <Link to='/'>Back</Link>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <label>
          Puzzle name
          <input autoComplete='off' defaultValue={strings.DEFAULT_PUZZLE_NAME} style={{width: '250px' }} {...register('title', { required: false, minLength: 1 })}/>
        </label>
        <br/>
        <label>
          The word to guess
          <input autoComplete='off' maxLength={12} {...register('puzzleWord', { required: true, minLength: 1, maxLength: 12, pattern: VALID_WORD_PATTERN })}/>
        </label>
        <br/>
        <label>   
          Number of guesses
          <input type='number' defaultValue={values.DEFAULT_NUMBER_OF_GUESSES_ALLOWED} min={1} max={100} {...register('numberOfGuesses', { required: true, min: 1, max: 100 })}/>
        </label>
        <br/>
        <input disabled={isLoading} type='submit' value='create'/>
        <ValidationMessage message={validationMessage}/>
      </form>
    </>
  );
}
