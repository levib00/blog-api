import React from "react";
import { useNavigate } from "react-router-dom";

export const Nav = ({setError, hasAuth, setHasAuth}) => {
  const navigate = useNavigate();

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
      if (response.status === 200) {
        deleteJWT()
        setHasAuth(false)
        navigate('/')
      } else {
        setError(response)
        navigate('/error')
      }
    } catch (error) {
      setError(error)
      navigate('/error')
    }
  }

  return (
    <nav className="nav">
      <h1><a href="/">Home</a></h1>
      <div className="nav-buttons">
        { hasAuth && <a href="/post/new"><button>New post</button></a> }
        { hasAuth ? <div className="log-out"><button className="log-out" onClick={logout}>Log out</button></div> : <a href="/log-in"><button>Log in</button></a> }
      </div>
    </nav>
  )
}