import React from "react";

export const Error = (error) => {

  return (
    <div className="errors">
      <p>Something went wrong.</p>
      <h1>{error.status}</h1>
      <a href="/"> Return to Home</a>
    </div>
  )
}