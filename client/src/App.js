import React, { useState } from "react";
import { SubmitPost } from './components/submit-form';
import { Nav } from './components/nav';
import { Home } from './components/home'
import { LogIn } from './components/log-in';
import { Error } from './components/error'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

function App() {
  const [error, setError] = useState()

  return (
    <div className="App">
      <BrowserRouter>
        <Nav setError={setError}  />
        <Routes>
          <Route path='/' element={<Home setError={setError} />} />
          <Route path="/post/new"  element={<SubmitPost /> } />
          <Route path="/:postId/edit"  element={<SubmitPost isEdit={true}/> } />
          <Route path="/log-in"  element={<LogIn /> } />
          <Route path='/error' element={<Error error={error}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
