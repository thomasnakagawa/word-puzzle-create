import { useCallback, useMemo } from "react";
import { Guess, LetterResult } from "../data/Guess";
import KeyboardLetterButton from "./KeyboardLetterButton";

const firstRow: string[] = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const secondRow: string[] = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const thirdRow: string[] = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

interface IProps {
  guesses: Guess[];
  onKeyClicked: (key: string) => void;
  onBackspace: () => void;
}

export default function Keyboard(props: IProps): JSX.Element {
  const { guesses, onKeyClicked } = props;

  const handleOnKeyClicked = useCallback(
    (key: string) => {
      onKeyClicked(key);
    },
    [onKeyClicked]
  );


  const keyResults: Map<string, LetterResult> = useMemo(
    () => {
      const resultPairs: { letter: string, result: LetterResult }[] = [];
      guesses.forEach(guess => {
        guess.forEach(guessCell => {
          resultPairs.push({ letter: guessCell.letter, result: guessCell.result });
        });
      });

      const result = new Map();
      [LetterResult.gray, LetterResult.yellow, LetterResult.green].forEach(letterResultValue => {
        resultPairs
          .filter(pair => pair.result === letterResultValue)
          .forEach(pair => {
            result.set(pair.letter, pair.result);
          })
      });
      return result;
    },
    [guesses]
  );

  const renderKey: (letter: string) => JSX.Element = (letter) => (
    <KeyboardLetterButton
      key={letter}
      keyLetter={letter}
      onClick={handleOnKeyClicked}
      letterResult={keyResults.get(letter)}
    />
  );

  return (
    <>
      <br/>
      { firstRow.map(renderKey) }
      <br/>
      { secondRow.map(renderKey) }
      <br/>
      { thirdRow.map(renderKey) }
      <br/>
      <KeyboardLetterButton
        key={'bsp'}
        keyLetter={'backspace'}
        onClick={props.onBackspace}
      />
    </>
  );
}
