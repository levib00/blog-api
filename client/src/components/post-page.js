import React, {  useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Comment } from './comment';
import { SubmitPost } from './submit-form';

import useSWR from 'swr';

export const PostPage = ({isAuthenticated, setError}) => {
  const navigate = useNavigate()
  const { postId }  = useParams()

  const fetcher = (url) => fetch(url, { 
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

  const {data: comments, mutate, error: commentError} = useSWR(`http://localhost:8000/comments/${postId}`, fetcher)

  useEffect(()=> {
    if(commentError) {
      setError(commentError)
      navigate('/error')
    }
  }, [commentError, navigate])

  return (
    <div className="post-page">
      <div className="post">
        {<SubmitPost isEdit={true} isAuthenticated={isAuthenticated} setError={setError} />}
      </div>
      <div className="comment-section">
        {comments && comments.map(comment => <Comment key={comment._id} refreshComments={mutate} comment={comment} />)}
      </div>
    </div>
  )
}