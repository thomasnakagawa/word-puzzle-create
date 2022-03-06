import React from 'react';
import { useParams } from 'react-router-dom';
import usePuzzle from '../hooks/usePuzzle';
import ErrorMessage from './ErrorMessage';
import { Game } from './Game';

export default function PlayPage(): JSX.Element {
  const { id } = useParams();
  const [puzzle, error] = usePuzzle(id);

  if (error) {
    return (
      <ErrorMessage message={error}/>
    );
  }

  if (!puzzle) {
    return (
      <h2>Loading...</h2>
    );
  }

  return (
    <>
      <h1>{(puzzle.title && puzzle.title.length > 0) ? puzzle.title : 'Word puzzle'}</h1>
      <h2>Guess the word!</h2>
      <Game puzzle={puzzle}/>
    </>
  );
}
