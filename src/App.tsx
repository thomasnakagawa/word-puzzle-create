import React from 'react';
import { HashRouter, Route,  Routes } from 'react-router-dom';
import CreatePage from './components/pages/CreatePage';
import ErrorMessage from './components/uiElements/ErrorMessage';
import AboutPage from './components/pages/AboutPage';
import Homepage from './components/pages/Homepage';
import SharePage from './components/pages/SharePage';
import PlayPage from './components/pages/PlayPage';

export default function App(): JSX.Element {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route index element={<Homepage/>}/>
          <Route path='/create'>
            <Route index element={<CreatePage/>}/>
            <Route path=':id' element={<SharePage/>}/>
          </Route>
          <Route path='/puzzle/:id' element={<PlayPage/>}/>
          <Route path='/about' element={<AboutPage/>}/>
          <Route path='*' element={<ErrorMessage message="Hmm that link didn't work..."/>}/>
        </Routes>
      </HashRouter>
    </div>
  );
}
