import React, { Component } from "react";
import API from "../../utils/API";
import Wrapper from "../../components/Wrapper";
import Nav from "../../components/Nav";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import { Link } from "react-router-dom";
// import { List, ListItem } from "../../components/List";
import {withRouter} from 'react-router';
import { Input, EditPhotoBtn } from "../../components/EditPhotoForm";
import Snackbar from 'material-ui/Snackbar';
import "./EditPhoto.css";

class EditPhoto extends Component {
	state = {
        photo: [],
        editTitle: "",
        open: false
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

    handleClick = () => {
        this.setState({
          open: true,
        });
    };

    handleRequestClose = () => {
        this.setState({
          open: false,
        });
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    };

    handleFormSubmit = event => {
        event.preventDefault();
        if (this.state.password === this.state.confirmPassword) {
            this.handleClick();
            API.updatePhoto({
                title: this.state.editTitle,
                id: this.state.photo.id
            })
            .then(res => console.log('title edited'))
            .catch(err => console.log(err));
            this.setState({editTitle: ""})
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
                        <EditPhotoBtn onClick={this.handleFormSubmit}/>
                </form>
            </MuiThemeProvider>
            <MuiThemeProvider>
                <Snackbar
                  open={this.state.open}
                  message="Photo Edited"
                  autoHideDuration={4000}
                  onRequestClose={this.handleRequestClose}
                />
            </MuiThemeProvider>
		  </Wrapper>
		);
	}
}

export default withRouter(EditPhoto);