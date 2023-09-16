import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Comment = ({comment, setError, refreshComments}) => {
  const commentDate = new Date(comment.timestamp)

  const navigate = useNavigate();
  

  const deleteComment = () => {
    console.log(comment._id)
    fetch(`http://localhost:8000/comments/${comment._id}/delete`, {
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
      refreshComments()
    })
    .catch(function(error) {
      setError(error)
      navigate('/error')
    });
  }

  return (
    <div className="comment">
      <h3>{comment.displayName}</h3>
      <div>{`${commentDate.getDate()}/${commentDate.getMonth()}/${commentDate.getFullYear()}`}</div>
      <div>{comment.content}</div>
      <button onClick={deleteComment}>delete</button>
    </div>
  )
}