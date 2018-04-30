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
// import LikeBtn from "../../components/LikeBtn";
import Checkbox from 'material-ui/Checkbox';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
// import Visibility from 'material-ui/svg-icons/action/visibility';
// import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import SvgIcon from 'material-ui/SvgIcon';
import {blue500, red500} from 'material-ui/styles/colors';

const HomeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </SvgIcon>
);

const CLOUDINARY_UPLOAD_PRESET = "a5flcvfp";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/colee/image/upload";

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  },
};

class Collection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadedFileCloudinaryUrl: "",
			collectionInfo: [],
			keywords: [],
			photos: [],
			editTitle: "",
			editLikes: "",
			checked: false,
			user: []
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
			user: res.data.user[0]
			})
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

	  updateCheck() {
	    this.setState((oldState) => {
	      return {
	        checked: !oldState.checked,
	      };
	    });
	  };

	  onCheck(event, isInputChecked) {
	    if (isInputChecked) {
	      console.log('liked');
	    } else {
	      console.log("unliked");
	    }
	  };

	  onChange(id) {
	  	API.addLike({
	    	id: id
	    })
	   .then(res => console.log(res))
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
	                    <PhotoList>
	                        {this.state.photos.map(photo => (
	                            <PhotoListItem 
	                                key={photo.id}
	                                id={photo.id} 
	                                url={photo.photo_link}
	                                title={photo.title}
	                                likes={photo.likes}     
	                            >
	                            	<MuiThemeProvider>
	                                  <div style={styles.block}>
								        <Checkbox
								          onCheck={this.onCheck}
								          onChange={this.onChange(photo.id)}
								          checkedIcon={<ActionFavorite />}
								          uncheckedIcon={<ActionFavoriteBorder />}
								          style={styles.checkbox}
								        />
								      </div>
								      </MuiThemeProvider>
								    
	                            	<Link to={`/editphoto/${photo.id}`}>Edit Photo</Link>

	                            	<DeletePhotoBtn onClick={() => this.deletePhoto(photo.id)} />
	                            </PhotoListItem>
	                        ))}

	                    </PhotoList>
	                ) : (
	                <h3>Add some photos!</h3>
	                )}
	            </div>
			</Wrapper>
		);
	}
}

export default withRouter(Collection);