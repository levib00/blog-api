import React, { useState, useEffect } from "react";

export const Nav = ({comment}) => { //receive props from app for when validation fails
  return (
    <div className="comment">
      <h1><a href="/">Home</a></h1>
      <a href="/post/new"><button>Create a new post</button></a>
    </div>
  )
}