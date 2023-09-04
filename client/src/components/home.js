import React, { useState, useEffect } from "react";
import {Post} from './post';


export const Home = () => {
  
  const [posts, setPosts] = useState();
  

  useEffect(() => {
    const getPosts = async() => {
      fetch('http://localhost:8000/posts', { //set localhost port
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        'Access-Control-Allow-Origin': '*',
        mode: 'cors'
      })
      .then(async function(response) {
        setPosts(await response.json())
      })
      .catch(function(error) {
        console.log("error---", error)
      });
    }
    getPosts()
  }, [])

  return (
    <div className="create-post">
      <span>see new posts</span>
      {posts && posts.map(post => <Post post={post} key={post._id} />)}
    </div>
  )
}