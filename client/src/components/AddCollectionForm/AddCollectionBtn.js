import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

export const AddCollectionBtn = props => (
	<RaisedButton label="Create Collection" primary={true} onClick={props.onClick} {...props} className="AddCollectionBtn" />
);