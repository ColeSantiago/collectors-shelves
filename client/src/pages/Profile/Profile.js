import React, { Component } from "react";
import API from "../../utils/API";
// import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import { Link } from "react-router-dom";

class Dashboard extends Component {
	state = {
		user: []
	};

    componentDidMount() {
  		this.currentUser();
  	}		

  	currentUser = () => {
  		API.getUser()
    	.then(res => {
    		this.setState({ user: res.data })
    		console.log(this.state.user);
   		})
    	.catch(err => console.log(err));
  	};
	
	render() {
		return (
			<div>
			<h1>hello {this.state.user.username}</h1>
			</div>
		);
	}
}

export default Dashboard;