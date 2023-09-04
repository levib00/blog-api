import React, { useState, useEffect } from "react";

export const Post = ({post}) => { //receive props from app for when validation fails
  const postDate = new Date(post.timestamp)

  const deletePost = () => {
    fetch(`http://localhost:8000/posts/${post._id}/delete`, { //set localhost port
      method: 'delete',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      'Access-Control-Allow-Origin': '*',
      mode: 'cors'
    })
    .then(function(response) {
      JSON.parse(response)
    })
    // It parses the output
    .catch(function(error) {
      console.log("error---", error)
    });
  }

  return (
    <div className="create-post">
      <div key={post._id}>
        <div>{`${postDate.getDate()}/${postDate.getMonth()}/${postDate.getFullYear()}`}</div>
        <div>{post.content}</div>
        <div className="action-buttons">
          <button onClick={deletePost}>Delete</button>
          <a href={`/${post._id}/edit`}><button>Edit</button></a>
        </div>
      </div>
    </div>
  )
}