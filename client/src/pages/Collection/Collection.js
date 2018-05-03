import React, { Component } from "react";
import { Link } from "react-router-dom";
import {withRouter} from "react-router";
import Dropzone from "react-dropzone";
import request from "superagent";

import API from "../../utils/API";
import "./Collection.css";

// components
import { PhotoList, PhotoListItem } from "../../components/PhotoListCollection";
import Wrapper from "../../components/Wrapper";
import DeletePhotoBtn from "../../components/DeletePhotoBtn";

// material ui
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Snackbar from 'material-ui/Snackbar';
// import CircularProgress from 'material-ui/CircularProgress';
import RefreshIndicator from 'material-ui/RefreshIndicator';

// cloudinary info
const CLOUDINARY_UPLOAD_PRESET = "a5flcvfp";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/colee/image/upload";

const style = {
  container: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

class Collection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadedFileCloudinaryUrl: "",
			collectionInfo: [],
			photos: [],
			editTitle: "",
			user: [],
			currentUser: [],
			open: false,
			isUser: false,
			photoLimit: 10,
			loading: false
		};
	};

	componentWillMount() {
		this.getCollection();
	};

	// getting the current collection
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

	// loads 10 more photos to the dashboard when clicked
    loadMore () {
        this.setState({photoLimit: this.state.photoLimit + 10});
        this.getCollection();
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    };

	// checking if the user viewing the page is the onwer of the collection
	userSpecific = () => {
		if ( this.state.user.id === this.state.currentUser.id) {
			this.setState({isUser: true})
		} else {
			this.setState({isUser: false})
		}
	};

	// deletes photos
	deletePhoto = id => {
		let photoId = {
			id: id
		}
	    API.deletePhoto(photoId)
	    .then(res => this.getCollection())
	    .catch(err => console.log(err));
	    this.getCollection();
	  };

	// snackbar function
	handleClick = () => {
        this.setState({
          open: true,
        });
    };

    // snackbar function
    handleRequestClose = () => {
        this.setState({
          open: false,
        });
    };

    // uploads photos
	onImageDrop(files) {
		this.setState({
			uploadedFile: files[0]
		});
		this.handleImageUpload(files[0]);
	};

	// uploads photos
	handleImageUpload(file) {
		this.setState({loading: true})
		setTimeout(() => this.setState({ loading: false }), 1500);
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
			<MuiThemeProvider>
				<Wrapper>
					<div className="owner-div">
						<p className="blongs-to">This collection belongs to </p>
						<Link className="blongs-to" to={`/profile/${this.state.user.username}/${this.state.user.id}`}>
							{this.state.user.username}
						</Link>
						<h1>{this.state.collectionInfo.title}</h1>
						<h2>{this.state.collectionInfo.description}</h2>
					</div>
					{this.state.isUser ? (
						<div className="dropzone-div">
							<Dropzone
								multiple={false}
								accept="image/*"
								onDrop={this.onImageDrop.bind(this)}
							>	
								<div style={style.container}>
									{this.state.loading ? (

										<RefreshIndicator
									      size={40}
									      left={10}
									      top={0}
									      status="loading"
									      style={style.refresh}
									    />
										) : (
												<p className="drop-text">Drop an image or click select a file to upload. </p>
											)}
								</div>
							</Dropzone>    
						</div>
					) : (
			                null
						)}
						<div className="collections">
			                {this.state.photos.length ? (
			                    <PhotoList>
			                        {this.state.photos.slice(0, this.state.photoLimit).map(photo => (
			                            <PhotoListItem 
			                                key={photo.id}
			                                id={photo.id} 
			                                url={photo.photo_link}
			                                title={photo.title}     
			                            >
			                            {this.state.isUser ? (
			                            	<div>
			                            		<Link to={`/editphoto/${photo.id}`}>
			                            			<button className="edit-photo-btn">Add Title</button>
			                            		</Link>
			                            		<DeletePhotoBtn className="delete" onClick={() => this.deletePhoto(photo.id)} />
			                            	</div>
			                            	) : (
			                            			null
												)}
			                            </PhotoListItem>
			                        ))}
			                        <button className="load-more-btn" onClick={this.loadMore.bind(this)}>
	                                    Load More
	                                </button>
			                    </PhotoList>
			                ) : (
			                <h3 className="warning">There are no photos here yet!</h3>
			                )}
			            </div>
		                <Snackbar
		                  open={this.state.open}
		                  message="Photo Uploaded"
		                  autoHideDuration={4000}
		                  onRequestClose={this.handleRequestClose}
		                />
				</Wrapper>
			</MuiThemeProvider>
		);
	}
}

export default withRouter(Collection);