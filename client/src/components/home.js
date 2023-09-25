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
        const token = localStorage.getItem('jwt');
        if (token) {
          return 'Bearer ' + localStorage.getItem('jwt')
        }
        return null
      })()
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

  useEffect(()=> {
    mutate()
  }, [hasAuth])

  return (
    <div className="content">
      <h2 className='posts-title'>Your Posts</h2>
      <div className="post-list">{posts && posts.map(post => <Post parseDom={parseDom} refreshPosts={mutate} post={post} key={post._id} setError={setError} hasAuth={hasAuth}/>)}</div>
    </div>
  )
}