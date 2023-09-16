import React, { useState, useEffect } from "react";
import './App.css';
import {Home} from './components/home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostPage } from "./components/postPage";
import { Nav } from './components/nav'
import { Error } from './components/error'

function App() {
  const [error, setError] = useState(null)
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<Home setError={setError} />} />
          <Route path="/:postId"  element={<PostPage setError={setError} /> } />
          <Route path="/error"  element={<Error error={error} /> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
