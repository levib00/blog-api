import React, { useState, useEffect } from "react";
import './App.css';
import {Home} from './components/home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostPage } from "./components/postPage";
import { Nav } from './components/nav'

function App() {
  return(
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/:postId"  element={<PostPage /> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
