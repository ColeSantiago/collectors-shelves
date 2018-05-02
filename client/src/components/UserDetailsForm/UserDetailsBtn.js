import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

export const UserDetailsBtn = props => (
  <RaisedButton label="Update All" primary={true} onClick={props.onClick} {...props} className="FormBtn" />
);