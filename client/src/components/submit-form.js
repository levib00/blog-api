import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid'

export const SubmitPost = ({isEdit, isAuthenticated, setError}) => { //receive props from app for when validation fails
  // State to hold the comment input
  const [titleInput, setTitleInput] = useState('');
  const [postInput, setPostInput] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [timestamp, setTimestamp] = useState(false);
  const [errors, setErrors] = useState([])
  const { postId }  = useParams()
  const navigate = useNavigate();
  // State to control the display of the sign-in modal

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/')
    }
  })

  const setValues = (inputs) => {
    const {title, content, isPublic, timestamp} = inputs
    console.log(inputs)
    setTitleInput(title)
    setPostInput(content)
    setIsPublic(isPublic)
    setTimestamp(timestamp)
  }

  const getPost = async() => {
    try {
      const response = await fetch(`http://localhost:8000/posts/${postId}`, {  
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      'Access-Control-Allow-Origin': '*',
      mode: 'cors'
    })
    setValues(await response.json())
  } catch(error) {
    setError(error)
    navigate('/error')
  }
  }

  useEffect(() => {
    if (isEdit) {
      getPost()
    }
  }, [])

  const editPost = async(e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8000/posts/${postId}/edit`, {  
        method: 'put',
        body : JSON.stringify({
          title: titleInput,
          content: postInput,
          timestamp: timestamp,
          isPublic: isPublic
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        'Access-Control-Allow-Origin': '*',
        mode: 'cors'
      })
      if (response.status === 200) {
        navigate('/')
      } else {
        const jsonResponse = await response.json()
          setErrors(jsonResponse.errors)
      }
    } catch(error) {
      setError(error)
      navigate('/error')
    }
  }

  const submitPost = async(e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/posts', {
        method: 'post',
        body : JSON.stringify({
          title: titleInput,
          content: postInput,
          isPublic: isPublic
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        'Access-Control-Allow-Origin': '*',
        mode: 'cors'
      })
      if (response.status === 200) {
        navigate('/')
      } else {
        const jsonResponse = await response.json()
        console.log(jsonResponse.errors)
        setErrors(jsonResponse.errors)
      }
    } catch (error) {
      setError(error)
      navigate('/error')
    }
  }

  return (
    <div className="create-post">
      <form>
        <label htmlFor='post-title'>Title</label>
        <div>{titleInput.length} / 48</div>
        <input id='post-title' type='text' onChange={(e) => setTitleInput(e.target.value)} value={titleInput}></input>
        {/* Textarea for entering the comment */}
        <label  htmlFor='post-textbox'>Post text</label>
        <textarea id='post-textbox' className="comment-textbox" onChange={(e) => setPostInput(e.target.value)} value={postInput}></textarea>
        <label htmlFor='public-box'>Make this public</label>
        <input id='public-box' type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}></input>
        {/* Button to save the comment */}
        { isEdit ? 
          <button type="submit" className="submit-post-button"  onClick={(e) => editPost(e)}>update</button>
          :
          <button type="submit" className="submit-post-button"  onClick={(e) => submitPost(e)}>save</button>
        }
      </form>
      {errors ? <ul>
        {errors.map(error => <li key={() => uuidv4()}>{error.msg}</li>)}
      </ul>
      :
      null}
    </div>
  )
}