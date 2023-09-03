import React, { useState, useEffect } from "react";
import { mutate } from "swr";

export const SubmitComment = ({ postId, refreshComments }) => { //receive props from app for when validation fails
  const [comment, setComment] = useState('');
  const [displayName, setDisplayName] = useState('');


  const clearForm = () => {
    setComment('');
    setDisplayName('')
  }

  const postComment = async(e, data = {}) => {
    e.preventDefault()
      const response = await fetch(`http://localhost:8000/comments`, { //set localhost port
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        'Access-Control-Allow-Origin': '*',
        mode: 'cors',
        body: JSON.stringify(data),
      })
      data.timestamp = 'now'
      // const jsonResponse = await response.json()
      refreshComments()
      clearForm()
      return response
  }

  return (
    <div className="create-comment">
      <form onSubmit={(e) => postComment(e, {content: comment, displayName: displayName, parentPost: postId})}>
        <label>Display name:</label>
        <input type="text" onChange={(e) => setDisplayName(e.target.value)} value={displayName}/>
        <label>comment:</label>
        <textarea onChange={(e) => setComment(e.target.value)} value={comment}/>
        <input type='submit' value='Submit'/>
      </form>
    </div>
  )
}