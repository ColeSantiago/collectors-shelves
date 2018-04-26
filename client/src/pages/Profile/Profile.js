import React, { Component } from "react";
import API from "../../utils/API";
import { Input, UserDetailsBtn } from "../../components/UserDetailsForm";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import { Link } from "react-router-dom";

class Dashboard extends Component {
	state = {
		user: [],
        editBio: "",
	};

    componentDidMount() {
  		this.currentUser();
        // this.getBio();
  	};		

    currentUser = () => {
        API.getUser()
        .then(res => {
            this.setState({ user: res.data.user })
        })
        .catch(err => console.log(err));
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    };

    handleFormSubmit = event => {
        event.preventDefault();
        if (this.state.editBio.length) {
          API.updateBio({
            bio: this.state.editBio
          })
          .then(res => console.log(res))
          .catch(err => console.log(err));
        }
    };
	
	render() {
		return (
			<div>
			 <h1>{this.state.user.username}</h1>
             <div>{this.state.user.bio}</div>
             <MuiThemeProvider>
                <form>
                    <Input
                        value={this.state.editBio}
                        onChange={this.handleInputChange}
                        multiLine={true}
                        rows={2}
                        rowsMax={4}
                        name="editBio"
                        hintText="Update Your Bio Here"
                    />
                    <UserDetailsBtn onClick={this.handleFormSubmit}>
                        Update
                    </UserDetailsBtn>
                </form>
            </MuiThemeProvider>
			</div>
		);
	}
}

export default Dashboard;