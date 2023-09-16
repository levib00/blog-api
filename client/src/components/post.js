import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const Post = ({post, hasAuth, setError, refreshPosts}) => {
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
      refreshPosts()
    })
    // It parses the output
    .catch(function(error) {
      setError(error)
      navigate('/error')
    });
  }

  const editPost = async(e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8000/posts/${post._id}/edit`, {  
        method: 'put',
        body : JSON.stringify({
          title: post.title,
          content: post.content,
          timestamp: post.timestamp,
          isPublic: !post.isPublic
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        'Access-Control-Allow-Origin': '*',
        mode: 'cors'
      })
      if (response.status === 200) {
        refreshPosts()
      }
    } catch(error) {
      setError(error)
    }
  }

  return (
    <div className="create-post">
      <div key={post._id}>
        <div>{`${postDate.getDate()}/${postDate.getMonth()}/${postDate.getFullYear()}`}</div>
        <div>{post.title}</div>
        <div className="action-buttons">
          {hasAuth && <button onClick={deletePost}>Delete</button>}
          {hasAuth && <a href={`/${post._id}/edit`}><button>Edit</button></a>}
          {hasAuth && (post.isPublic ? <button onClick={(e) => editPost(e)}>Make private</button> : <button onClick={(e) => editPost(e)}>Make public</button>)} 
        </div>
      </div>
    </div>
  )
}