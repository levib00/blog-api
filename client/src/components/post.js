import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiSquareEditOutline } from '@mdi/js';
import { mdiTrashCanOutline } from '@mdi/js';


export const Post = ({post, hasAuth, setError, refreshPosts, parseDom}) => {
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
      if (response.status === 200) {
        refreshPosts()
      }
    } catch(error) {
      setError(error)
    }
  }

  return (
    <div className="post">
      <div className="post-info">
        <h3 className="post-title">{parseDom(post.title)}</h3>
        <div>{`${postDate.getDate()}/${postDate.getMonth()}/${postDate.getFullYear()}`}</div>
      </div>
      <div className="action-buttons">
      {hasAuth && (post.isPublic ? <button className="publish-button" onClick={(e) => editPost(e)}>Unpublish</button> : <button className="publish-button" onClick={(e) => editPost(e)}>Publish</button>)} 
        <div className="top-post-buttons">
          {hasAuth && <a href={`/${post._id}/edit`}><button><Icon path={mdiSquareEditOutline} size={1} /></button></a>}
          {hasAuth && <button onClick={deletePost}><Icon path={mdiTrashCanOutline} size={1} /></button>}
        </div>
      </div>
    </div>
  )
}