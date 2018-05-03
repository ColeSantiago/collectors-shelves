import React from "react";
import "./List.css";

export const PhotoListItem = props => (
  <li>
	   <img className="collection-photo" src={props.url} alt={props.title} /> <br></br>
	   {props.title}
	   {props.children}
  </li>
);


