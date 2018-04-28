import React, { Component } from "react";
import Dropzone from "react-dropzone";
import request from "superagent";
import API from "../../utils/API";
// import { Input, AddCollectionBtn } from "../../components/AddCollectionForm";
// import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import { Link } from "react-router-dom";

import {withRouter} from 'react-router';


const CLOUDINARY_UPLOAD_PRESET = 'a5flcvfp';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/colee/image/upload';

class Collection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadedFileCloudinaryUrl: '',
			collection: [],
			keywords: [],
			photos: []
		}
	};

	componentWillMount() {
		this.getCollection();;
	};

	getCollection = () => {
		API.loadCollection(this.props.match.params.id)
		.then(res => this.setState({collection: res.data[0]}))
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
			}
		});
	};

	render() {
		return (
			<div>
			<h1>{this.state.collection.title}</h1>
			<h2>{this.state.collection.description}</h2>
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
			</div>
		);
	}
}

export default withRouter(Collection);