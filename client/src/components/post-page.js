import React, {  useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Comment } from './comment';
import { SubmitPost } from './submit-form';

import useSWR from 'swr';

export const PostPage = ({hasAuth, setError, parseDom}) => {
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
      navigate('/error') // redirect to error page on error.
    }
  }, [commentError, navigate])

  return (
    <div className="content">
      <div className="post-form">
        {<SubmitPost isEdit={true} hasAuth={hasAuth} setError={setError} parseDom={parseDom} />}
      </div>
      <div className="comment-section">
        {comments && comments.map(comment => <Comment key={comment._id} refreshComments={mutate} hasAuth={hasAuth} comment={comment} parseDom={parseDom} />)}
      </div>
    </div>
  )
}