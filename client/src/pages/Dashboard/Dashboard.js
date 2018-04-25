import React, { Component } from "react";
import API from "../../utils/API";

class Dashboard extends Component {
	state = {
		user: []
	};

    componentDidMount() {
  		this.currentUser();
  		console.log(this.state.user)
  	}		

  	currentUser = () => {
  		API.getUser()
    	.then(res =>
    		this.setState({ user: res.data })
   		)
    	.catch(err => console.log(err));
  	};
	

	render() {
		return (
			<h1>hey</h1>
		);
	}
}

export default Dashboard;