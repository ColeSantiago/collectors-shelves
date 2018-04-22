import React, { Component } from "react";
import Dropzone from "react-dropzone";
import request from "superagent";

const CLOUDINARY_UPLOAD_PRESET = 'a5flcvfp';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/colee/image/upload';

class AddCollection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadedFileCloudinaryUrl: ''
		}
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
	}

	render() {
		return (
			<div>
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

export default AddCollection;