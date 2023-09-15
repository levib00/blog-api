import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const Post = ({post, hasAuth, setError}) => {
  const navigate = useNavigate();
  const postDate = new Date(post.timestamp)

  const deletePost = () => {
    fetch(`http://localhost:8000/posts/${post._id}/delete`, {
      method: 'delete',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      'Access-Control-Allow-Origin': '*',
      mode: 'cors'
    })
    .then(function(response) {
      window.location.reload(false)
      navigate('/')
    })
    // It parses the output
    .catch(function(error) {
      setError(error)
      navigate('/error')
    });
  }

  return ( // TODO: Add put functions to private and public buttons
    <div className="create-post">
      <div key={post._id}>
        <div>{`${postDate.getDate()}/${postDate.getMonth()}/${postDate.getFullYear()}`}</div>
        <div>{post.title}</div>
        <div className="action-buttons">
          {hasAuth && <button onClick={deletePost}>Delete</button>}
          {hasAuth && <a href={`/${post._id}/edit`}><button>Edit</button></a>}
          {hasAuth && (post.isPublic ? <button>Make private</button> : <button>Make public</button>)} 
        </div>
      </div>
    </div>
  )
}