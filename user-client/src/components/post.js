import React, { useState, useEffect } from "react";

export const Post = ({post}) => { //receive props from app for when validation fails

  return (
    <div className="create-post">
      <div key={post._id}>
        <h2>{post.title}</h2>
        <div>{post.displayName}</div>
        <div>{post.timestamp}</div>
        <div>{post.content}</div>
      </div>
    </div>
  )
}