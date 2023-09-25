import React from "react";

export const Comment = ({comment, parseDom}) => {
  const commentDate = new Date(comment.timestamp)

  return (
    <div className="comment">
      <div className="comment-info">
        <h3>{parseDom(comment.displayName)}</h3>
        <span>{`${commentDate.getDate()}/${commentDate.getMonth()}/${commentDate.getFullYear()}`}</span>
      </div>
      <p className="comment-content">{parseDom(comment.content)}</p>
    </div>
  )
}