import React, { useState } from "react";
import { SubmitPost } from './components/submit-form';
import { Nav } from './components/nav';
import { Home } from './components/home'
import { LogIn } from './components/log-in';
import { Error } from './components/error'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostPage } from "./components/post-page";

function App() {
  const [error, setError] = useState()

  const isAuthenticated = () => {
    const cookie = document.cookie
    return !!cookie
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Nav setError={setError} isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path='/' element={<Home setError={setError} isAuthenticated={isAuthenticated} />} />
          <Route path="/post/new"  element={<SubmitPost isAuthenticated={isAuthenticated} setError={setError} /> } />
          <Route path="/:postId/edit"  element={<PostPage isAuthenticated={isAuthenticated} setError={setError} /> } />
          <Route path="/log-in"  element={<LogIn isAuthenticated={isAuthenticated} setError={setError} /> } />
          <Route path='/error' element={<Error error={error}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
