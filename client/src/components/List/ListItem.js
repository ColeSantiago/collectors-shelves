import React from "react";
import "./List.css";

export const ListItem = props => (
  <li className="list-group-item">
    <a className="title" href={props.link} target="_blank">{props.title}</a>
  </li>
);