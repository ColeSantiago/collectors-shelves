import React from "react";
import "./List.css";
import { Link } from "react-router-dom";

export const NotificationListItem = props => (
  <li className="list-group-item">
   <Link to={`/profile/${props.friendUsername}/${props.id}`}>{props.message} </Link> <br></br>
    {props.children}
  </li>
);


