import React from 'react';

interface IProps {
  message?: string;
}

export default function ValidationMessage(props: IProps): JSX.Element {
  return props.message ? <p style={{ color: 'red', margin: 0 }}>{props.message}</p> : <></>;
}