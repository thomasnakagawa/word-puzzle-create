import React from 'react';
import { useParams } from 'react-router-dom';
import usePuzzle from '../../hooks/usePuzzle';
import ErrorMessage from '../uiElements/ErrorMessage';
import Game from '../Game';

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

  return <Game puzzle={puzzle}/>;
}
