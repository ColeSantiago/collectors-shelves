import React from "react";
import "./List.css";
import { Link } from "react-router-dom";

export const ListItem = props => (
  <li>
   <img className="collection-photo" src={props.url} alt={props.title} />
   {props.title}
   {props.children}
  </li>
);


