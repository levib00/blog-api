import React, { useState, useEffect } from "react";

export const SubmitComment = ({post}) => { //receive props from app for when validation fails

  return (
    <div className="create-comment">
      <form>
        <label></label>
        <input type="text"></input>
        <label></label>
        <input type="textbox"></input>
      </form>
    </div>
  )
}