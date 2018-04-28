import React from "react";
import "../List/List.css";

const EditPhotoBtn = props => (
  <button className="btn" onClick={() => props.updateState(props.id)} {...props}>
    Edit Photo
  </button>
);

export default EditPhotoBtn;