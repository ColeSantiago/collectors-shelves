import React from "react";
import "./List.css";

export const PhotoListItem = props => (
  <li>
	   <img className="collection-photo" src={props.url} alt={props.title} />
	   {props.title}
	   {props.likes}
	   {props.children}
  </li>

);


