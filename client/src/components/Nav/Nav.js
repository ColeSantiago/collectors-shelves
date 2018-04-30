import React from "react";
import "./Nav.css"
import { Link } from "react-router-dom";
import SvgIcon from 'material-ui/SvgIcon';
import {blue500, red500} from 'material-ui/styles/colors';

const HomeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </SvgIcon>
);

const Nav = props => (
	<nav>
		<Link className="navbar-link" to="/dashboard">
			<HomeIcon color={red500} hoverColor={blue500} />
    	</Link>
    	<Link to={`/profile/${props.username}/${props.id}`}>
			Profile
    	</Link>

	</nav>
); 

export default Nav;

