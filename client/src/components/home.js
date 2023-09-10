import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useNavigate } from "react-router-dom";
import { Post } from './post';

export const Home = () => {
  const navigate = useNavigate()
  
    const fetcher = (url) => fetch(url, { //set localhost port
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      'Access-Control-Allow-Origin': '*',
      mode: 'cors'
    })
    .then(res => res.json())
    .catch(function(error) {
      console.log("error---", error)
    });
  
    const {data: posts, error} = useSWR(`http://localhost:8000/posts`, fetcher)

    useEffect(()=> {
      if(error) {
        navigate('/error')
      }
    }, [error, navigate])

  return (
    <div className="create-post">
      <span>see new posts</span>
      {posts && posts.map(post => <Post post={post} key={post._id} />)}
    </div>
  )
}