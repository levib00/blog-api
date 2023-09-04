import React, { useState } from "react";
import { useParams } from "react-router-dom";

export const SubmitPost = (isEdit) => { //receive props from app for when validation fails
  // State to hold the comment input
  const [titleInput, setTitleInput] = useState('');
  const [postInput, setPostInput] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [errors, setErrors] = useState([])
  const { postId }  = useParams()
  // State to control the display of the sign-in modal

  const editPost = (e) => {
    e.preventDefault()
    try {
      fetch('http://localhost:8000/posts', { 
      method: 'put',
      body : JSON.stringify({
        title: titleInput,
        content: postInput,
        timeStamp: Date.now(),
        isPublic: isPublic
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      'Access-Control-Allow-Origin': '*',
      mode: 'cors'
    })
    } catch(error) {
      console.log("error---", error)
    }
  }

  const submitPost = async(e) => {
    e.preventDefault()
    try {
      const response = fetch('http://localhost:8000/posts', {
        method: 'post',
        body : JSON.stringify({
          title: titleInput,
          content: postInput,
          isPublic: isPublic
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        'Access-Control-Allow-Origin': '*',
        mode: 'cors'
      })
    } catch (error) {
      console.log("error---", error)
    }
  }

  return (
    <div className="create-post">
      <form>
        <label htmlFor='post-title'>Title</label>
        <input id='post-title' type='text' onChange={(e) => setTitleInput(e.target.value)} value={titleInput}></input>
        {/* Textarea for entering the comment */}
        <label  htmlFor='post-textbox'>Post text</label>
        <textarea id='post-textbox' className="comment-textbox" onChange={(e) => setPostInput(e.target.value)} value={postInput}></textarea>
        <label htmlFor='public-box'>Make this public</label>
        <input id='public-box' type="checkbox" onChange={(e) => setIsPublic(e.target.checked)}></input>
        {/* Button to save the comment */}
        <button type="submit" className="submit-post-button" onClick={isEdit ? (e) => submitPost(e) : (e) => editPost(e)}>save</button>
      </form>
      {errors ? <ul>
        {errors.map(error => <li>{error}</li>)}
      </ul>
      :
      null}
    </div>
  )
}