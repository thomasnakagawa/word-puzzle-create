import React from 'react';
import { Link } from 'react-router-dom';

export default function Aboutpage(): JSX.Element {
  return (
    <>
      <h1>About</h1>
      <a href='https://github.com/thomasnakagawa/word-puzzle-create'>source</a>
      <br/>
      <br/>
      <Link to='/'>back</Link>
    </>
  );
}