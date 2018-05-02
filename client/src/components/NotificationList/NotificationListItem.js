import React from "react";
import "./List.css";
// import { Link } from "react-router-dom";

export const NotificationListItem = props => (
  <li onClick={props.onClick}>
    {props.children}
  </li>
);


