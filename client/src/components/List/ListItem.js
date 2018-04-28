import React from "react";
import "./List.css";

export const ListItem = props => (
  <li className="list-group-item">
    {props.title} <br></br>
    {props.description} <br></br>
    {props.children}
  </li>
);

// <a className="title" href={props.link} target="_blank">{props.title}</a>