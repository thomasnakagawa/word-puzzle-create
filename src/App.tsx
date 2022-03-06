import React from 'react';
import { BrowserRouter, Link, Route,  Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import CreatePage from './components/CreatePage';
import './App.css';
import PlayPage from './components/PlayPage';
import ErrorMessage from './components/ErrorMessage';
import AboutPage from './components/AboutPage';

export default function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage/>}/>
          <Route path='/create'>
            <Route index element={<CreatePage/>}/>
          </Route>
          <Route path='/puzzle/:id' element={<PlayPage/>}/>
          <Route path='/about' element={<AboutPage/>}/>
          <Route path='*' element={<ErrorMessage message="Hmm that link didn't work..."/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
