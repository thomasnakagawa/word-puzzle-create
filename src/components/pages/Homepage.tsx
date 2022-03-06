import React from 'react';
import { Link } from 'react-router-dom';

export default function Homepage(): JSX.Element {
  return (
    <>
      <h1>Word puzzle builder</h1>
      <Link to='create'>Start</Link>
      <br/>
      <br/>
      <br/>
      <Link to='about'>about</Link>
    </>
  );
}