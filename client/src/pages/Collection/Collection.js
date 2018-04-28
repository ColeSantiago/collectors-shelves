import React, { Component } from "react";
import Dropzone from "react-dropzone";
import request from "superagent";
import API from "../../utils/API";
import { List, ListItem } from "../../components/PhotoList";
import Wrapper from "../../components/Wrapper";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import {withRouter} from "react-router";
import DeletePhotoBtn from "../../components/DeletePhotoBtn";

const CLOUDINARY_UPLOAD_PRESET = "a5flcvfp";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/colee/image/upload";

class Collection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadedFileCloudinaryUrl: "",
			collectionInfo: [],
			keywords: [],
			photos: [],
			editTitle: ""
		}
	};

	componentWillMount() {
		this.getCollection();
	};

	getCollection = () => {
		API.loadCollection(this.props.match.params.id)
		.then(res =>  {
			this.setState({
			collectionInfo: res.data.collectionInfo,
			photos: res.data.photos
			})
			console.log(res.data.photos);
		})
		.catch(err => console.log(err));
	};

	deletePhoto = id => {
		let photoId = {
			id: id
		}
	    API.deletePhoto(photoId)
	    .then(res => this.getCollection())
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
				API.savePhoto(photoData)
				.then(res => console.log(res))
				.catch(err => console.log(err));
			}
		});
	};

	render() {
		return (
			<Wrapper>
			<h1>{this.state.collectionInfo.title}</h1>
			<h2>{this.state.collectionInfo.description}</h2>
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
				<div className="collections">
	                {this.state.photos.length ? (
	                    <List>
	                        {this.state.photos.map(photo => (
	                            <ListItem 
	                                key={photo.id}
	                                id={photo.id} 
	                                url={photo.photo_link}
	                                title={photo.title}      
	                            >
	                            	<Link to={`/editphoto/${photo.id}`}>
	                            	<button>Edit Photo</button>
	                            	</Link>
	                            	<DeletePhotoBtn onClick={() => this.deletePhoto(photo.id)} />
	                            </ListItem>
	                        ))}

	                    </List>
	                ) : (
	                <h3>Add some photos!</h3>
	                )}
	            </div>
			</Wrapper>
		);
	}
}

export default withRouter(Collection);