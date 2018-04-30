import React from "react";
import "./List.css";

export const NotificationList = ({ children }) => {
  return (
    <div className="list-div">
      <ul className="list-group">
        {children}
      </ul>
    </div>
  );
};