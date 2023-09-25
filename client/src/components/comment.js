import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';

export const Comment = ({comment, setError, refreshComments, hasAuth}) => {
  const commentDate = new Date(comment.timestamp)

  const navigate = useNavigate();
  

  const deleteComment = () => {
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
      setError(error) // set error then redirect to error page.
      navigate('/error')
    });
  }

  return (
    <div className="comment">
      <div className="comment-text">
        <div className="comment-info">
          <h3 className="display-name">{comment.displayName}</h3>
          <div className="comment-date">{`${commentDate.getDate()}/${commentDate.getMonth()}/${commentDate.getFullYear()}`}</div>
        </div>
        <div>{comment.content}</div>
      </div>
      {hasAuth && <button className="delete-comment-button" onClick={deleteComment}><Icon path={mdiTrashCanOutline} size={1} /></button>}
    </div>
  )
}