import React from 'react';
import { Guess, LetterResult } from "../data/Guess";

interface IGuessRowProps {
  solutionLength: number;
  guess?: Guess;
  guessNumber: number;
}

export default function GuessRow(props: IGuessRowProps): JSX.Element {
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
        <span>{props.guessNumber}: {'_ '.repeat(props.solutionLength)}</span>
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
