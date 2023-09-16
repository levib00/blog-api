import React, { useState, useEffect } from "react";
import {Post} from './post';
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr';


export const Home = ({setError}) => {  
  const navigate = useNavigate()

  const fetcher = (url) => fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    'Access-Control-Allow-Origin': '*',
    mode: 'cors'
  })
  .then(res => res.json());

  const {data: posts, error} = useSWR(`http://localhost:8000/posts`, fetcher)

  useEffect(()=> {
    if(error) {
      setError(error)
    }
  }, [error, navigate])

  return (
    <div className="create-post">
      <span>see new posts</span>
      {posts && posts.map(post => <Post post={post} key={post._id} />)}
    </div>
  )
}