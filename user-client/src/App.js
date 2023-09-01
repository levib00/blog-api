import React, { useState, useEffect } from "react";
import './App.css';
import {Home} from './components/home'
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return(
    <div>
      <BrowserRouter>
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/:postId"  element={<PostPage uid={uid} posts={posts} db={db} updateObj={updateObj} updateDb={updateDb} signIn={signIn} getUserName={getUserName} setTopic={setTopic} postSetter={postSetter} /> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
