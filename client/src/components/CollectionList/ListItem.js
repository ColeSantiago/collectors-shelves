import React from "react";
import "./List.css";
import { Link } from "react-router-dom";

export const ListItem = props => (
  <li className="list-group-item">
   <Link to={`/collection/${props.id}`}>{props.title} </Link> <br></br>
    {props.description} <br></br>
    {props.children}
  </li>
);


