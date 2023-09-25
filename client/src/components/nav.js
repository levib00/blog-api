import React from "react";
import { useNavigate } from "react-router-dom";

export const Nav = ({setError, hasAuth, setHasAuth}) => {
  const navigate = useNavigate();

  const deleteJWT = () => { 
    localStorage.removeItem('jwt'); // Remove jwt on log out.
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
      if (response.status === 200) {
        deleteJWT() // if user is logged out delete jwt
        setHasAuth(false) // set auth state
        navigate('/') // and redirect home in case user is on restricted page.
      } else {
        setError(response)
        navigate('/error') // redirect to error page.
      }
    } catch (error) {
      setError(error)
      navigate('/error') // redirect to error page.
    }
  }

  return (
    <nav className="nav">
      <h1><a href="/">Home</a></h1>
      <div className="nav-buttons">
        { hasAuth && <a href="/post/new"><button>New post</button></a> } {/* if user is logged in show new post button. */}
        { hasAuth ? <div className="log-out"> {/* Change whether log in or log out button shows depending on if user is logged in */}
            <button className="log-out" onClick={logout}>Log out</button>
          </div>
          :
          <a href="/log-in">
            <button>Log in</button>
          </a> }
      </div>
    </nav>
  )
}