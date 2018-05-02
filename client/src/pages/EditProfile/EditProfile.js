import React, { Component } from "react";
// import { Link } from "react-router-dom";
import {withRouter} from 'react-router';
import Dropzone from "react-dropzone";
import request from "superagent";

import API from "../../utils/API";
import "./EditProfile.css";

// components
import Wrapper from "../../components/Wrapper";
// import Nav from "../../components/Nav";
import { Input, UserDetailsBtn } from "../../components/UserDetailsForm";

// material ui
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Snackbar from 'material-ui/Snackbar';

const CLOUDINARY_UPLOAD_PRESET = "a5flcvfp";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/colee/image/upload";

class EditPhoto extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploadedFileCloudinaryUrl: "",
            photo: "",
            editBio: "",
            user: [],
            open:false
        };
    };

    // handles form input change
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    };

    // handles form submit to update the users profile picture and bio
    handleFormSubmit = event => {
        event.preventDefault();
        if (this.state.editBio.length === 0) {
            API.updateBio({
                photo: this.state.uploadedFileCloudinaryUrl
              })
              .then(res => {
                console.log("updated");
            })
              .catch(err => console.log(err));
              this.handleClick();
        } if (this.state.uploadedFileCloudinaryUrl.length === 0) {
            API.updateBio({
                bio: this.state.editBio,
            })
            .then(res => {
                console.log("updated");
            })
            .catch(err => console.log(err));
            this.handleClick();
        } else {
            API.updateBio({
                bio: this.state.editBio,
                photo: this.state.uploadedFileCloudinaryUrl
              })
              .then(res => {
                console.log("updated");
            })
              .catch(err => console.log(err));
              this.handleClick();
        }
    };

    // snackbar function
    handleClick = () => {
        this.setState({
          open: true,
        });
        this.setState({
            uploadedFileCloudinaryUrl: ""
        });
        this.setState({
            editBio: ""
        });
    };

    // snackbar function
    handleRequestClose = () => {
        this.setState({
          open: false,
        });
    };

    // uploads photo
    onImageDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });
        this.handleImageUpload(files[0]);
    };

    // uploads photo
    handleImageUpload(file) {
        let upload = request.post(CLOUDINARY_UPLOAD_URL)
                            .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                            .field('file', file);

        upload.end((err, response) => {
            if (err) {
                throw err
            } if (response.body.secure_url !== '') {
                this.setState({
                    uploadedFileCloudinaryUrl: response.body.secure_url
                });
            }
        });
    };
	
	render() {
		return (
            <MuiThemeProvider>
    		  <Wrapper>
                  <div className="dropzone-div">
                    <Dropzone
                        multiple={false}
                        accept="image/*"
                        onDrop={this.onImageDrop.bind(this)}
                    >
                        <p className="drop-text">Drop an image or click select a file to upload. </p>
                    </Dropzone>
                        <div>
                            {this.state.uploadedFileCloudinaryUrl === '' ? null :
                                <div>
                                    <p>{this.state.uploadedFile.name}</p>
                                    <img src={this.state.uploadedFileCloudinaryUrl} alt={this.state.uploadedFile.name}/>
                                    <p className="warning">Your photo isn't saved yet, hit update all to finish</p>
                                </div>
                            }
                        </div>
                    </div>
                        <form className="update-profile-form">
                            <Input
                                value={this.state.editBio}
                                onChange={this.handleInputChange}
                                multiLine={true}
                                rows={2}
                                rowsMax={4}
                                name="editBio"
                                hintText="Update Your Bio Here"
                            />
                            <UserDetailsBtn className="update-btn" onClick={this.handleFormSubmit} />
                        </form>
                        <Snackbar
                          open={this.state.open}
                          message="Profile Edited!"
                          autoHideDuration={4000}
                          onRequestClose={this.handleRequestClose}
                        />
    		  </Wrapper>
          </MuiThemeProvider>
		);
	}
}

export default withRouter(EditPhoto);