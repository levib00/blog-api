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
    <div className="submit-comment">
      <form className="comment-form" onSubmit={(e) => postComment(e, {content: comment, displayName: displayName, parentPost: postId})}>
        <div>
          <div className="form-display-name-info">
            <label>Display name:</label>
            <span>{displayName.length} / 16</span>
          </div>
          <input className="display-name-input" type="text" onChange={(e) => setDisplayName(e.target.value)} value={displayName} required/>
        </div>
        <div>
          <div className="form-comment-info">
            <label>comment:</label>
            <span>{comment.length} / 300</span>
          </div>
          <textarea className="comment-input" onChange={(e) => setComment(e.target.value) } value={comment} required/>
        </div>
        <div className="space-button">
          <input className="submit-comment-button" type='submit' value='Submit'/>
        </div>
      </form>
      <ul className="error-list">
        {errors && errors.map(error => <li key={() => uuidv4()}>{error.msg}</li>)}
      </ul>
    </div>
  )
}