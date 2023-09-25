import React, { useState, useEffect } from "react";
import './App.css';
import {Home} from './components/home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostPage } from "./components/post-page";
import { Nav } from './components/nav'
import { Error } from './components/error'
import { Footer } from './components/footer'
import './styles/styles.css'

function App() {
  const [error, setError] = useState(null)

  const parseDom = (str) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<Home setError={setError} parseDom={parseDom} />} />
          <Route path="/:postId"  element={<PostPage setError={setError} parseDom={parseDom} /> } />
          <Route path="/error"  element={<Error error={error} /> } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App;
