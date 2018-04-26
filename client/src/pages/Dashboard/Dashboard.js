import React, { Component } from "react";
import API from "../../utils/API";
import Wrapper from "../../components/Wrapper";
import Nav from "../../components/Nav";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";


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
			<Wrapper>
      <MuiThemeProvider>
      <Nav />
      </MuiThemeProvider>
  			<h1>hey {this.state.user.username}</h1>
  			    <Link to="/profile">
                Go To Your Profile
            </Link>
			</Wrapper>
		);
	}
}

export default Dashboard;