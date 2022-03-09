import { ReactNode, useCallback, useMemo, useState } from "react";
import SuccessMessage from "./SuccessMessage";
import ValidationMessage from "./ValidationMessage";

interface IProps {
  content: string;
  text?: string;
}

export default function CopyButton(props: IProps): JSX.Element {
  const [result, setResult] = useState<'success' | 'failed' | undefined>(undefined);
  
  const copy: () => void = useCallback(() => {
    setResult(undefined);

    navigator.clipboard.writeText(props.content)
      .then(() => {
        setResult('success');
        setTimeout(() => {
          setResult(undefined);
        }, 1500);
      })
      .catch(() => {
        setResult('failed');
      });
  }, [props.content]);

  const message: ReactNode = useMemo(() => {
    if (result === 'success') {
      return <SuccessMessage message="Copied!"/>
    }
    if (result === 'failed') {
      return <ValidationMessage message="Failed to copy"/>
    }
    return <p style={{opacity: 0, margin: 0}}>-</p>;
  }, [result]);

  return (
    <>
      <button onClick={copy}>{props.text ?? 'Copy'}</button>
      {message}
    </>
  );
}
