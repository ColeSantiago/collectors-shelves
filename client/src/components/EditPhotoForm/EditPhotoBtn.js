import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

export const EditPhotoBtn = props => (
	<RaisedButton label="Edit Photo Title" primary={true} onClick={props.onClick} {...props} className="EditPhotoBtn" />
);