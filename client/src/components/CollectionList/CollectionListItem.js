import React from "react";
import "./List.css";
import { Link } from "react-router-dom";

export const CollectionListItem = props => (
  <li className="collection-li">
   <Link className="collection-item" to={`/collection/${props.id}`}>{props.title} </Link> <br></br>
    {props.description} <br></br>
    {props.children}
  </li>
);


