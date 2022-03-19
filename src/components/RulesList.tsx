import { IExtraRules } from "../data/PuzzleTypes";

interface IProps {
  rules?: IExtraRules;
}

export default function RulesList(props: IProps): JSX.Element {
  const ruleStyle: React.CSSProperties = {
    backgroundColor: 'lightSlateGray',
    color: 'white'
  };
  return (
    <>
      <h2>Guess the word!</h2>
      { props.rules?.nonDictionaryAllowed && (
        <p style={ruleStyle}>⭐ The solution might not be a real word! Your guesses don't have to be real words for this puzzle</p>
      )}
    </>
  );
}
