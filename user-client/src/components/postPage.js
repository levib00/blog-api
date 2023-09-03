import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Post } from './post';
import { Comment } from './comment';
import { SubmitComment } from './submit-comment';
import useSWR from 'swr';

export const PostPage = () => { //receive props from app for when validation fails
  const { postId }  = useParams()

  const fetcher = (url) => fetch(url, { //set localhost port
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

  return (
    <div className="post-page">
      <div className="post">
        {post && <Post postId={postId} post={post} />}
      </div>
      <div className="comment-section">
        <SubmitComment postId={postId} refreshComments={mutate}/>
        {comments && comments.map(comment => <Comment key={comment._id} comment={comment} />)}
      </div>
    </div>
  )
}