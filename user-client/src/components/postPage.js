import React, {  useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from './post';
import { Comment } from './comment';
import { SubmitComment } from './submit-comment';
import useSWR from 'swr';

export const PostPage = ({setError}) => {
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

  const {data: post, error: postError} = useSWR(`http://localhost:8000/posts/${postId}`, fetcher)
  const {data: comments, mutate, error: commentError} = useSWR(`http://localhost:8000/comments/${postId}`, fetcher)

  useEffect(()=> {
    if(postError) {
      setError(postError)
      navigate('/error')
    } else if(commentError) {
      setError(commentError)
      navigate('/error')
    }
  }, [commentError, postError, navigate])

  return (
    <div className="post-page">
      <div className="post">
        {post && <Post postId={postId} post={post[0]} />}
      </div>
      <div className="comment-section">
        <SubmitComment postId={postId} refreshComments={mutate} setError={setError}/>
        {comments && comments.map(comment => <Comment key={comment._id} comment={comment} />)}
      </div>
    </div>
  )
}