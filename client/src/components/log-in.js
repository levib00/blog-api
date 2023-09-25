import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LogIn = ({ hasAuth, setError, setHasAuth }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errors, setErrors] = useState([])
  const navigate = useNavigate();
  // State to control the display of the sign-in modal

  useEffect(() => {
    if (hasAuth) {
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
        setHasAuth(localStorage.getItem('jwt'))
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
    <div className="content">
      <div className="sign-in-container">
        <form className="sign-in-form">
          <div>
            <div className="label-container"><label htmlFor='username' className="username-label">Username:</label></div>
            <input id='username' className="username sign-in-input" type='text' onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}></input>
          </div>
          <div>
            <div className="label-container"><label  htmlFor='password' className="password-label">Password:</label></div>
            <input type="password" id='password' className="password sign-in-input" onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}></input>
          </div>
          <button type="submit" className="sign-in-button" onClick={ (e) => login(e) }>Sign in</button>
        </form>
        {errors.length > 0 ? <ul>
          {errors.map(error => <li>{error}</li>)}
        </ul>
        :
        null}
      </div>
    </div>
  )
}