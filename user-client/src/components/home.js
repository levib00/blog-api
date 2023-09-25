import React, { useEffect } from "react";
import {Post} from './post';
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr';


export const Home = ({setError, parseDom}) => {
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

  // SWR is used to fetch on page load without useEffect.
  const {data: posts, error} = useSWR(`http://localhost:8000/posts`, fetcher)

  useEffect(()=> {
    if(error) {
      setError(error) // set Error for error page.
      navigate('/error')
    }
  }, [error, navigate])

  return (
    <div className="content">
      <div className="post-list">{posts && posts.map(post => <Post post={post} parseDom={parseDom} key={post._id} />)}</div>
    </div>
  )
}