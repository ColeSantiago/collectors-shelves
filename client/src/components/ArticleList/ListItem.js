import React from "react";
import "./List.css";

export const ListItem = props => (
  <li className="list-group-item">
   <a href={props.link}>{props.title}</a> <br></br>
    {props.children}
  </li>
);


