import { useCallback } from "react";
import { LetterResult } from "../data/Guess";
import { letterStyle } from "./GuessRow";

interface IProps {
  keyLetter: string;
  letterResult?: LetterResult;
  onClick: (key: string) => void;
}

export default function KeyboardLetterButton(props: IProps): JSX.Element {
  const onClick: () => void = useCallback(
    () => {
      props.onClick(props.keyLetter);
    },
    [props]
  );

  return (
    <button
      onClick={onClick}
      style={letterStyle(props.letterResult)}
    >
      { props.keyLetter }
    </button>
  );
}
