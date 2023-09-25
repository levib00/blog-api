import React, { useState } from "react";
import { SubmitPost } from './components/submit-form';
import { Nav } from './components/nav';
import { Home } from './components/home'
import { LogIn } from './components/log-in';
import { Error } from './components/error'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostPage } from "./components/post-page";
import { Footer } from "./components/footer"
import './styles/styles.css'

function App() {
  const [error, setError] = useState()
  const [hasAuth, setHasAuth] = useState(localStorage.getItem('jwt'))

  const parseDom = (str) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Nav setError={setError} hasAuth={hasAuth} setHasAuth={setHasAuth} />
        <Routes>
          <Route path='/' element={<Home setError={setError} parseDom={parseDom} hasAuth={hasAuth} setHasAuth={setHasAuth} />} />
          <Route path="/post/new"  element={<SubmitPost hasAuth={hasAuth} setError={setError} setHasAuth={setHasAuth} /> } />
          <Route path="/:postId/edit"  element={<PostPage parseDom={parseDom} hasAuth={hasAuth} setError={setError} setHasAuth={setHasAuth} /> } />
          <Route path="/log-in"  element={<LogIn hasAuth={hasAuth} setError={setError} setHasAuth={setHasAuth}/> } />
          <Route path='/error' element={<Error error={error}/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
