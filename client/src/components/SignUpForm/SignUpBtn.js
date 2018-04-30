import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

export const SignUpBtn = props => (
	<RaisedButton label="Sign Up" primary={true} onClick={props.onClick} {...props} className="SignUpBtn" />
);