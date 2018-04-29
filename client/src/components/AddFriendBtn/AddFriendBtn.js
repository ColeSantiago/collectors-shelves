import React from "react";

const AddFriendBtn = props => (
  <button className="AddFriendBtn" {...props}>
   {props.children}
   Add Friend
  </button>
);

export default AddFriendBtn;