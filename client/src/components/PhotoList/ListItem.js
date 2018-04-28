import React from "react";
import "./List.css";
import { Link } from "react-router-dom";

export const ListItem = props => (
  <li className="list-group-item">
   <img src={props.url} alt="photo" />
   {props.children}
  </li>
);


