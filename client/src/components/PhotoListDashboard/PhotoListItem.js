import React from "react";
import "./List.css";
import { Link } from "react-router-dom";

export const PhotoListItem = props => (
  <li className="li-photo-dashboard">
  	<Link to={`/collection/${props.collectionId}`}>
	   <img className="collection-photo" src={props.url} alt={props.title} /><br></br>
	   <p className="photo-title">{props.title}</p>
	   {props.children}
   </Link>
  </li>
);


