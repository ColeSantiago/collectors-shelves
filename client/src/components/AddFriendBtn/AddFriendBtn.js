import React from "react";

const AddFriendBtn = props => (
  <button className="AddFriendBtn" {...props}>
  	{props.children}
  	Follow
  </button>
);

export default AddFriendBtn;