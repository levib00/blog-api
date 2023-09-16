import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from "react-router-dom";
import { Post } from './post';

export const Home = ({ isAuthenticated, setError }) => {
  const navigate = useNavigate()
  const [hasAuth, setHasAuth] = useState()

  useEffect(()=> {
    setHasAuth(isAuthenticated())
  }, [isAuthenticated])
  
  const fetcher = (url) => fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
    'Access-Control-Allow-Origin': '*',
    mode: 'cors'
  })
  .then(res => res.json());

  const {data: posts, mutate, error} = useSWR(`http://localhost:8000/posts`, fetcher)

  useEffect(()=> {
    if(error) {
      setError(error)
      navigate('/error')
    }
  }, [error, navigate])

  return (
    <div className="create-post">
      <span>see new posts</span>
      {posts && posts.map(post => <Post refreshPosts={mutate} post={post} key={post._id} setError={setError} hasAuth={hasAuth}/>)}
    </div>
  )
}