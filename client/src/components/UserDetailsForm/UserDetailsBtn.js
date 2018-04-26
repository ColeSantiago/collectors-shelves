import React from "react";

export const UserDetailsBtn = props => (
  <button onClick={props.onClick} {...props} className="FormBtn">
    {props.children}
  </button>
);