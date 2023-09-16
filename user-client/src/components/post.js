import React, { useState, useEffect } from "react";

export const Post = ({post, postId}) => {
  const postDate = new Date(post.timestamp)

  return (
    <div className="create-post">
      <div key={post._id}>
        {postId === post._id ?
          <h2>{post.title}</h2>
          :
          <a href={`/${post._id}`}><button className="search-button"><h2>{post.title}</h2></button></a> 
        }
        <div>{`${postDate.getDate()}/${postDate.getMonth()}/${postDate.getFullYear()}`}</div>
        <div>{post.content}</div>
      </div>
    </div>
  )
}