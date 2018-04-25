import React from "react";

export const FormBtn = props => (
  <button onClick={props.onClick} {...props} className="FormBtn">
    {props.children}
  </button>
);