import React from "react";
import "./Input.css"

export const Input = props => (
  <div className="form-div">
    <input className="form-input" {...props} />
  </div>
);