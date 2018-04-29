import React, { Component } from "react";
import API from "../../utils/API";
import Wrapper from "../../components/Wrapper";
import Nav from "../../components/Nav";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import { Link } from "react-router-dom";
// import { List, ListItem } from "../../components/List";
import {withRouter} from 'react-router';
import { Input, EditPhotoBtn } from "../../components/EditPhotoForm";
import "./EditPhoto.css";

class EditPhoto extends Component {
	state = {
        photo: [],
        editTitle: ""
	};

    componentWillMount() {
        this.loadPhoto();
    };

    loadPhoto = () => {
        API.loadPhoto(this.props.match.params.id)
        .then(res => {
            this.setState({
                photo: res.data
            })
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
        if (this.state.password === this.state.confirmPassword) {
          API.updatePhoto({
            title: this.state.editTitle,
            id: this.state.photo.id
          })
          .then(res => console.log('title edited'))
          .catch(err => console.log(err));
        }
    };
	
	render() {
		return (
		  <Wrapper>
            <MuiThemeProvider>
                <Nav />
            </MuiThemeProvider>
            <img src={this.state.photo.photo_link} alt={this.state.photo.photo_link} />
            <MuiThemeProvider>
                <form>
                    <Input
                        value={this.state.editTitle}
                        onChange={this.handleInputChange}
                        name="editTitle"
                        floatingLabelText="Photo Title"
                    />
                        <EditPhotoBtn onClick={this.handleFormSubmit} />
                </form>
            </MuiThemeProvider>
		  </Wrapper>
		);
	}
}

export default withRouter(EditPhoto);