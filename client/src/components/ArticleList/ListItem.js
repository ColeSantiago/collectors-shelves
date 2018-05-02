import React from "react";
import "./List.css";

export const ListItem = props => (
  <li>
  	<a className="article-item" href={props.link} target="_blank">{props.title}</a> <br></br>
    {props.children}
  </li>
);


