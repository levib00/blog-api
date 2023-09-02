import React, { useState, useEffect } from "react";

export const Comment = ({comment}) => { //receive props from app for when validation fails
  const commentDate = new Date(comment.timestamp)

  return (
    <div className="comment">
      <h3>{comment.displayName}</h3>
      <div>{`${commentDate.getDate()}/${commentDate.getMonth()}/${commentDate.getFullYear()}`}</div>
      <div>{comment.content}</div>
    </div>
  )
}