import React, { Component } from "react";
import { Link } from "react-router-dom";
import {withRouter} from 'react-router';
import Dropzone from "react-dropzone";
import request from "superagent";

import API from "../../utils/API";
import "./EditProfile.css";

// components
import Wrapper from "../../components/Wrapper";
import Nav from "../../components/Nav";
import { Input, UserDetailsBtn } from "../../components/UserDetailsForm";

// material ui
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

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
          API.updateBio({
            bio: this.state.editBio,
            photo: this.state.uploadedFileCloudinaryUrl
          })
          .then(res => {
            console.log("updated");
        })
          .catch(err => console.log(err));
        
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
		  <Wrapper>
            <MuiThemeProvider>
                <Nav />
            </MuiThemeProvider>
            <Dropzone
                multiple={false}
                accept="image/*"
                onDrop={this.onImageDrop.bind(this)}
            >
                <p>Drop an image or click select a file to upload. </p>
            </Dropzone>
                <div>
                    {this.state.uploadedFileCloudinaryUrl === '' ? null :
                        <div>
                            <p>{this.state.uploadedFile.name}</p>
                            <img src={this.state.uploadedFileCloudinaryUrl} alt={this.state.uploadedFile.name}/>
                            <p>Your photo isn't saved yet, hit update all to finish</p>
                        </div>
                    }
                </div>
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
                        <Link to={`/profile/${this.state.user.username}/${this.state.user.id}`}>
                            <UserDetailsBtn onClick={this.handleFormSubmit}>
                                Update All
                            </UserDetailsBtn>
                        </Link>
                    </form>
                </MuiThemeProvider>
		  </Wrapper>
		);
	}
}

export default withRouter(EditPhoto);