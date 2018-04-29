import React, { Component } from "react";
import API from "../../utils/API";
import Dropzone from "react-dropzone";
import request from "superagent";
import Wrapper from "../../components/Wrapper";
import Nav from "../../components/Nav";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import { Link } from "react-router-dom";
// import { List, ListItem } from "../../components/List";
import {withRouter} from 'react-router';
import { Input, UserDetailsBtn } from "../../components/UserDetailsForm";
import "./EditProfile.css";

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

    componentWillMount() {
        // this.loadPhoto();
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
        // event.preventDefault();
          API.updateBio({
            bio: this.state.editBio,
            photo: this.state.uploadedFileCloudinaryUrl
          })
          .then(res => {
            console.log(res);
            this.props.history.push("/profile")
        })
          .catch(err => console.log(err));
        
    };

    onImageDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });
        this.handleImageUpload(files[0]);
    };

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
                let photoData = {
                    photo: response.body.secure_url,
                    collectionId: this.props.match.params.id
                }
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
                        <UserDetailsBtn onClick={this.handleFormSubmit}>
                            Update
                        </UserDetailsBtn>
                    </form>
                </MuiThemeProvider>
		  </Wrapper>
		);
	}
}

export default withRouter(EditPhoto);