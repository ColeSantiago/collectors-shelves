import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

export const SignInBtn = props => (
<RaisedButton label="Sign In" secondary={true} onClick={props.onClick} {...props} />
);