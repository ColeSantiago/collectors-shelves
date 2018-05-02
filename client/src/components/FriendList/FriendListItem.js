import React from "react";
import "./List.css";
// import { Link } from "react-router-dom";

export const FriendListItem = props => (
  <li onClick={props.onClick} className="list-group-item">
    {props.children}
  </li>
);


