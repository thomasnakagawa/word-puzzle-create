import { Link } from "react-router-dom";
import { Guess, LetterResult } from "../data/Guess";
import CopyButton from "./uiElements/CopyButton";

interface IProps {
  puzzleTitle: string;
  didWin: boolean;
  solutionWord: string;
  guesses: Guess[];
  guessesAllowed: number;
}

export default function Results(props: IProps): JSX.Element {
  const url: string = window.location.toString();

  const resultTitle: string = `${props.puzzleTitle} ${props.guesses.length}/${props.guessesAllowed}`;

  const resultGrid: string = props.guesses
    .map(
      (guess) => guess.reduce(
        (str, cell) => str + resultEmoji(cell.result),
        ''
      )
    )
    .join('\n');

  const resultFooter: string = url;

  const resultString: string = [resultTitle, resultGrid, resultFooter].join('\n');

  return (
    <>
      <br/>
      <br/>
      <h2>{props.didWin ? 'Congrats! You guessed the word' : `Out of guesses!`}</h2>
      <h3>Share your results:</h3>
      <p>{resultTitle}</p>
      <p style={{whiteSpace: 'pre-line'}}>{resultGrid}</p>
      <p>{resultFooter}</p>
      <CopyButton text='Copy your results' content={resultString}/>
      <br/>
      <Link to='/'>Create your own word puzzle </Link>
    </>
  );
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
