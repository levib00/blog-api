import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Nav = ({comment, setError}) => {
  const navigate = useNavigate();

  const checkIsAuthenticated = () => { // TODO: move to App and pass through props.
    const cookie = document.cookie
    return !!cookie
  }

  const isAuthenticated = checkIsAuthenticated()

  const deleteJWT = () => {
    localStorage.removeItem('jwt');
  }

  const logout = async(e) => {
    try {
      const response = await fetch('http://localhost:8000/users/log-out', {
        method: 'post',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        mode: 'cors'
      })
      console.log(response)
      if (response.status === 200) {
        deleteJWT()
        navigate('/')
      } else {
        setError(response)
        navigate('/error')
      }
    } catch (error) {
      console.log("error---", error)
    }
  }

  return (
    <div className="comment">
      <h1><a href="/">Home</a></h1>
      {isAuthenticated && <a href="/post/new"><button>Create a new post</button></a>}
      { isAuthenticated ? <button onClick={logout}>Log out</button>: <a href="/log-in"><button>Log in</button></a>}
    </div>
  )
}