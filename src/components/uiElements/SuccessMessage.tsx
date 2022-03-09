import React from 'react';

interface IProps {
  message?: string;
}

export default function SuccessMessage(props: IProps): JSX.Element {
  return props.message ? <p style={{ color: 'green', margin: 0 }}>{props.message}</p> : <></>;
}
