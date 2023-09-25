import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid'

export const SubmitPost = ({isEdit, setError, hasAuth, parseDom}) => { //receive props from app for when validation fails
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
    if (!hasAuth) {
      navigate('/')
    }
  })

  const setValues = (inputs) => {
    const {title, content, isPublic, timestamp} = inputs
    setTitleInput(parseDom(title))
    setPostInput(parseDom(content))
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
        Authorization: (() => {
          const token = localStorage.getItem('jwt');
          if (token) {
            return 'Bearer ' + localStorage.getItem('jwt')
          }
          return null
        })()
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
          Authorization: (() => {
            const token = localStorage.getItem('jwt');
            if (token) {
              return 'Bearer ' + localStorage.getItem('jwt')
              
            }
            return null
          })()
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
          Authorization: (() => {
            const token = localStorage.getItem('jwt');
            if (token) {
              return 'Bearer ' + localStorage.getItem('jwt')
            }
            return null
          })()
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
    } catch (error) {
      setError(error)
      navigate('/error')
    }
  }

  return (
    <div className={!isEdit ? "content" : "submit-form"}>
      <div class="submit-form">
        <form>
          <div className="title">
            <div className="title-info">
              <label htmlFor='post-title'>Title:</label>
              <span className="char-counter">{titleInput.length} / 48</span>
            </div>
            <div><input id='post-title' type='text' className='title-input' onChange={(e) => setTitleInput(e.target.value)} value={titleInput}></input></div>
          </div>
          {/* Textarea for entering the comment */}
          <div className="post-content">
            <label  htmlFor='post-textbox'>Post text:</label>
          </div>
            <textarea id='post-textbox' className="post-textbox" onChange={(e) => setPostInput(e.target.value)} value={postInput}></textarea>
          <div className="centered-form-elements">
            <div>
              <label htmlFor='public-box'>Make this public:</label>
              <input id='public-box' type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}></input>
            </div>
            {/* Button to save the comment */}
            { isEdit ?
              <button type="submit" className="submit-post-button"  onClick={(e) => editPost(e)}>Update</button>
              :
              <button type="submit" className="submit-post-button"  onClick={(e) => submitPost(e)}>Save</button>
            }
          </div>
        </form>
        {errors ? <ul>
          {errors.map(error => <li key={() => uuidv4()}>{error.msg}</li>)}
        </ul>
        :
        null}
      </div>
    </div>
  )
}