import React from "react";

export const Post = ({post, postId, parseDom}) => {
  const postDate = new Date(post.timestamp)

  return (
    <div className="post">
        <div key={post._id}>
          {postId === post._id ?
            <h3 className="post-title">{parseDom(post.title)}</h3>
            :
            <a href={`/${post._id}`}><button className="title-button"><h3 className="post-title">{parseDom(post.title)}</h3></button></a>
          }
          <div>{`${postDate.getDate()}/${postDate.getMonth()}/${postDate.getFullYear()}`}</div>
          {postId === post._id ?
            null
            :
            <a href={`/${post._id}`}><button className="title-button see-comments">See comments</button></a>
          }
        </div>
        <p className="post-content">{parseDom(post.content)}</p>
    </div>
  )
}