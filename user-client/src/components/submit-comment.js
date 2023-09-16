import React, { useState, useEffect } from "react";
import {v4 as uuidv4} from 'uuid'
import { useNavigate } from 'react-router-dom'

export const SubmitComment = ({ postId, refreshComments, setError }) => {
  const [comment, setComment] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState('');

  const navigate = useNavigate()

  const clearForm = () => {
    setComment('');
    setDisplayName('')
  }

  const postComment = async(e, data = {}) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8000/comments`, {
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
      if (response.status === 200) {
        refreshComments()
        clearForm()
      } else {
        const jsonResponse = await response.json()
        setErrors(jsonResponse.errors)
      }
    } catch (error) {
      setErrors(error)
      navigate('/error')
    }
  }

  return (
    <div className="create-comment">
      <form onSubmit={(e) => postComment(e, {content: comment, displayName: displayName, parentPost: postId})}>
        <label>Display name:</label>
        <div>{displayName.length} / 16</div>
        <input type="text" onChange={(e) => setDisplayName(e.target.value)} value={displayName}/>
        <label>comment:</label>
        <div>{comment.length} / 300</div>
        <textarea onChange={(e) => setComment(e.target.value)} value={comment}/>
        <input type='submit' value='Submit'/>
      </form>
      <ul>
        {errors && errors.map(error => <li key={() => uuidv4()}>{error.msg}</li>)}
      </ul>
    </div>
  )
}