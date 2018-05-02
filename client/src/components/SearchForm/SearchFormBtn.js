import React from "react";

export const SearchFormBtn = props => (
  <button onClick={props.onClick} {...props}>
  	Search
    {props.children}
  </button>
);