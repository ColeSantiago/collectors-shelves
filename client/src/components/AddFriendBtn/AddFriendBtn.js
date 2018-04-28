import React from "react";

const AddFriendBtn = props => (
  <button className="AddFriendBtn" {...props}>
   {props.children}
  </button>
);

export default AddFriendBtn;