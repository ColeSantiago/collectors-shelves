import React from "react";
import "./List.css";
import { Link } from "react-router-dom";

export const PhotoListItem = props => (
  <li>
  	<Link to={`/collection/${props.collectionId}`}>
	   <img className="collection-photo" src={props.url} alt={props.title} />
	   {props.title}
	   {props.children}
   </Link>
  </li>

);


