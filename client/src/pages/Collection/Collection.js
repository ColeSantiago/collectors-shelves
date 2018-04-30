import React, { Component } from "react";
import Dropzone from "react-dropzone";
import request from "superagent";
import API from "../../utils/API";
import { PhotoList, PhotoListItem } from "../../components/PhotoListCollection";
import Wrapper from "../../components/Wrapper";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import {withRouter} from "react-router";
import DeletePhotoBtn from "../../components/DeletePhotoBtn";
import SvgIcon from 'material-ui/SvgIcon';
import {blue500, red500} from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';

const HomeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </SvgIcon>
);

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
			editTitle: "",
			user: [],
			currentUser: [],
			open: false,
			isUser: false,
		};
	};

	componentWillMount() {
		this.getCollection();
	};

	getCollection = () => {
		API.loadCollection(this.props.match.params.id)
		.then(res =>  {
			this.setState({
			collectionInfo: res.data.collectionInfo,
			photos: res.data.photos,
			user: res.data.user[0],
			currentUser: res.data.currentUser[0]
			})
			this.userSpecific();
		})
		.catch(err => console.log(err));
	};

	userSpecific = () => {
		if ( this.state.user.id === this.state.currentUser.id) {
			this.setState({isUser: true})
		} else {
			this.setState({isUser: false})
		}
	};

	deletePhoto = id => {
		let photoId = {
			id: id
		}
	    API.deletePhoto(photoId)
	    .then(res => this.getCollection())
	    .catch(err => console.log(err));
	    this.getCollection();
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
			this.handleClick();
			this.getCollection();
		});
	};

	render() {
		return (
			<Wrapper>
				<MuiThemeProvider>
					<Link className="navbar-link" to="/dashboard">
						<HomeIcon color={red500} hoverColor={blue500} />
	    			</Link>
    			</MuiThemeProvider>

				<Link to={`/profile/${this.state.user.username}/${this.state.user.id}`}>
					{this.state.user.username}
				</Link>
			<h1>{this.state.collectionInfo.title}</h1>
			<h2>{this.state.collectionInfo.description}</h2>
			{this.state.isUser ? (
				<Dropzone
					multiple={false}
					accept="image/*"
					onDrop={this.onImageDrop.bind(this)}
				>
					<p>Drop an image or click select a file to upload. </p>
				</Dropzone>
			) : (
	                null
				)}
				<div className="collections">
	                {this.state.photos.length ? (
	                    <PhotoList>
	                        {this.state.photos.map(photo => (
	                            <PhotoListItem 
	                                key={photo.id}
	                                id={photo.id} 
	                                url={photo.photo_link}
	                                title={photo.title}     
	                            >
	                            {this.state.isUser ? (
	                            	<div>
	       								
	                            		<Link to={`/editphoto/${photo.id}`}>Edit Photo</Link>
	                            		<DeletePhotoBtn onClick={() => this.deletePhoto(photo.id)} />
	                            	</div>
	                            	) : (
	                            			null
										)}
	                            </PhotoListItem>
	                        ))}

	                    </PhotoList>
	                ) : (
	                <h3>There are no photos here yet!</h3>
	                )}
	            </div>
		        <MuiThemeProvider>
	                <Snackbar
	                  open={this.state.open}
	                  message="Photo Uploaded"
	                  autoHideDuration={4000}
	                  onRequestClose={this.handleRequestClose}
	                />
	            </MuiThemeProvider>
			</Wrapper>
		);
	}
}

export default withRouter(Collection);