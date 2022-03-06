import React from 'react';
import { Link } from 'react-router-dom';

export default function Aboutpage(): JSX.Element {
  return (
    <>
      <h1>About</h1>
      <Link to='/'>back</Link>
    </>
  );
}