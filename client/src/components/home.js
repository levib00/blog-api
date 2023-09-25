import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useNavigate } from "react-router-dom";
import { Post } from './post';

export const Home = ({ hasAuth, setError, parseDom }) => {
  const navigate = useNavigate()
  
  const fetcher = (url) => fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization: (() => {
        const token = localStorage.getItem('jwt'); // Gets token from local storage and formats it for verifyToken.
        if (token) {
          return 'Bearer ' + token
        }
        return null
      })()
    },
    'Access-Control-Allow-Origin': '*',
    mode: 'cors'
  })
  .then(res => res.json());

  //SWR is used to fetch on page load without useEffect.
  const {data: posts, mutate, error} = useSWR(`http://localhost:8000/posts`, fetcher)

  useEffect(()=> {
    if(error) {
      setError(error) // Set error then redirect to error page.
      navigate('/error')
    }
  }, [error, navigate])

  useEffect(()=> { // Refresh posts if auth state changes.
    mutate()
  }, [hasAuth])

  return (
    <div className="content">
      <h2 className='posts-title'>Your Posts</h2>
      <div className="post-list">{posts && posts.map(post => <Post parseDom={parseDom} refreshPosts={mutate} post={post} key={post._id} setError={setError} hasAuth={hasAuth}/>)}</div>
    </div>
  )
}