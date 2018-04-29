import React, { Component } from "react";
import { Input, AddCollectionBtn } from "../../components/AddCollectionForm";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import API from "../../utils/API";

class AddCollection extends Component {
	state = {
		user: [],
		title: "",
		description: "",
	}

	componentDidMount() {
  		this.currentUser();
  	};		

    currentUser = () => {
        API.getUserAndActivity()
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
        
        if (this.state.title.length) {
          API.createCollection({
            userId: this.state.user.id,
            title: this.state.title,
            description: this.state.description
          })
          .then(res => console.log(res))
          .catch(err => console.log(err));
        }
    };

	render() {
		return (
			<div>
				<h1>Describe your collection first, you'll upload your pictures in a second.</h1>
				{this.state.user.id}
				<MuiThemeProvider>
		          <form>
		              <Input
		                  value={this.state.title}
		                    onChange={this.handleInputChange}
		                    name="title"
		                    floatingLabelText="Collection Title"
		                  />
		                  <Input
		                    value={this.state.description}
		                    onChange={this.handleInputChange}
		                    name="description"
		                    floatingLabelText="Collection Description"
		                  />
		                  <Link to="/profile">
		                  	<AddCollectionBtn onClick={this.handleFormSubmit} />
		                  </Link>
		                  <Link className="nevermind-link" to="/profile">
		                    Nevermind
		                  </Link>
		            </form>
		        </MuiThemeProvider>
			</div>
		);
	}
}

export default AddCollection;