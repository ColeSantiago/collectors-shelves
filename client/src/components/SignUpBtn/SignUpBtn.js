import React from "react";

export const SignUpBtn = props => (
  <button onClick={props.onClick} {...props} className="SignUpBtn">
    {props.children}
  </button>
);