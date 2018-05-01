import React from "react";
import "./List.css";

export const ListItem = props => (
  <li>
  	<a className="article-item" href={props.link}>{props.title}</a> <br></br>
    {props.children}
  </li>
);


