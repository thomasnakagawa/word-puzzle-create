import { Link } from "react-router-dom";
import { Guess, LetterResult } from "../data/Guess";

interface IProps {
  puzzleTitle: string;
  didWin: boolean;
  solutionWord: string;
  guesses: Guess[];
  guessesAllowed: number;
}

export default function Results(props: IProps): JSX.Element {
  return (
    <>
      <br/>
      <br/>
      <h2>{props.didWin ? 'Congrats! You guessed the word' : `Out of guesses! The word is "${props.solutionWord}"`}</h2>
      <h3>Share your results:</h3>
      <p>{props.puzzleTitle} {props.guesses.length}/{props.guessesAllowed}</p>
      { props.guesses.map((guess, guessIndex) => (
        <div key={guessIndex}>
          <span key={`guess-row-${guessIndex}`}>
            { guess.map((guessCell, guessCellIndex) => (
              <span key={`guess-cell-${guessIndex}-${guessCellIndex}`}>
                { resultEmoji(guessCell.result) }
              </span>
            ))}
          </span>
        </div>
      ))}
      <p>{window.location.toString()}</p>
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
