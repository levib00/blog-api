import React, {  useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from './post';
import { Comment } from './comment';
import { SubmitComment } from './submit-comment';
import useSWR from 'swr';

export const PostPage = ({setError, parseDom}) => {
  const navigate = useNavigate()
  const { postId }  = useParams()

  const fetcher = async url => {
      const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      'Access-Control-Allow-Origin': '*',
      mode: 'cors'
    })

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      error.info = await res.text()
      error.status = res.status
      throw error
    }

    return res.json()
  }

  //SWR is used to fetch on page load without useEffect.
  const {data: post, error: postError} = useSWR(`http://localhost:8000/posts/${postId}`, fetcher)
  const {data: comments, mutate, error: commentError} = useSWR(`http://localhost:8000/comments/${postId}`, fetcher)

  useEffect(()=> {
    if(postError) {
      setError(postError)
      navigate('/error') // redirect to error page.
    }
  }, [commentError, postError, navigate])

  return (
    <div className="content">
        <div className="post-page-post">
          {post && <Post postId={postId} post={post[0]} parseDom={parseDom}/>}
        </div>
      <div className="comment-section">
        <SubmitComment postId={postId} refreshComments={mutate} setError={setError}/>
        <div className="comments-container">
          {comments && comments.map(comment => <Comment key={comment._id} parseDom={parseDom} comment={comment} />)}
        </div>
      </div>
    </div>
  )
}