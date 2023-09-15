import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LogIn = ({ isAuthenticated, setError }) => { //receive props from app for when validation fails
  // State to hold the comment input
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errors, setErrors] = useState([])
  const navigate = useNavigate();
  // State to control the display of the sign-in modal

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/')
    }
  })

  const login = async(e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/users/log-in', {
        method: 'post',
        body : JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        mode: 'cors'
      })
      if (response.status === 200) {
        const tokenObject = await response.json()
        localStorage.setItem('jwt', await tokenObject.token)
        navigate('/')
      } else if (response.status === 401) {
        setErrors(['Wrong username or password.'])
      } else {
        setErrors(['Something went wrong. Please try again.'])
      }
    } catch (error) {
      setError(error)
      navigate('/error')
    }
  }

  return (
    <div className="create-post">
      <form>
        <label htmlFor='post-title'>username</label>
        <input id='post-title' type='text' onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}></input>
        {/* Textarea for entering the comment */}
        <label  htmlFor='post-textbox'>password</label>
        <input type="text" id='post-textbox' className="comment-textbox" onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}></input>
        {/* Button to save the comment */}
        <button type="submit" className="submit-post-button" onClick={ (e) => login(e) }>save</button>
      </form>
      {errors.length > 0 ? <ul>
        {errors.map(error => <li>{error}</li>)}
      </ul>
      :
      null}
    </div>
  )
}