import React, { Component } from "react";
import { Link } from "react-router-dom";
import {withRouter} from "react-router";
import Clap from "react-clap-button";

import API from "../../utils/API";
import Placeholder from "./placeholder.png";
import "./Profile.css";

// components
import { CollectionList, CollectionListItem } from "../../components/CollectionList";
import { NotificationList, NotificationListItem } from "../../components/NotificationList";
import DeleteCollectBtn from "../../components/DeleteCollectBtn";
import AddFriendBtn from "../../components/AddFriendBtn";

// material ui
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';

class Profile extends Component {
	state = {
		user: [],
        bio: "",
        collections: [],
        friends: [],
        notifications: [],
        currentUser: [],
        isUser: false,
        isClicked: false
	};

    componentDidMount() {
  		this.getUserAndCollections();
  	};	

    // gets the user's profile, with their bio, collections, friends, and notification, as well as the current
    // logged user
    getUserAndCollections = () => {
        API.getUserProfile(this.props.match.params.username, this.props.match.params.id)
        .then(res => {
            this.setState({
                user: res.data.user,
                bio: res.data.user.bio,
                collections: res.data.collection,
                friends: res.data.friends,
                notifications: res.data.notifications,
                currentUser: res.data.currentUser[0]
            })
            this.userSpecific();
        })
        .catch(err => console.log(err));
    };

    getNextUser = (username, id) => {
        API.getUserProfile(username, id)
        .then(res => {
            console.log(res)
            this.setState({
                user: res.data.user,
                bio: res.data.user.bio,
                collections: res.data.collection,
                friends: res.data.friends,
                notifications: res.data.notifications,
                currentUser: res.data.currentUser[0]
            })
            this.userSpecific();
        })
        .catch(err => console.log(err));
        
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

    // checking if the user viewing the page is the onwer of the collection
    userSpecific = () => {
        if ( this.state.user.id === this.state.currentUser.id) {
            this.setState({isUser: true})
        } else {
            this.setState({isUser: false})
        }
    };

    // deletes collections
    deleteCollection = id => {
        API.deleteCollection({
            id: id
        })
        .then(res => console.log("collection deleted"))
        .catch(err => console.log(err));
        this.getUserAndCollections();
    };

    // adds friends
    addFriend(id, username, friendUsername) {
        API.addFriend({
            friendId: id,
            username: username,
            friendUsername: friendUsername
        })
        .then(res => console.log('friend added'))
        .catch(err => console.log(err));
        this.handleClick();
    };

    // deletes friends
    deleteFriend = id => {
        API.deleteFriend({
            friendId: id
        })
        .then(res => console.log("unfriended"))
        .catch(err => console.log(err));
        this.getUserAndCollections();
    }

    // handles the clap function
    handleClap(userId, username) {
        if (this.state.isClicked === false) {
            this.setState({isClicked: true})
            API.addClap({
                id: userId,
                username: username
            })
            .then(res => console.log('clap'))
            .catch(err => console.log(err));
            this.getUserAndCollections();
        } else {
            console.log("disliked")
            this.setState({isClicked: false})
        }
    };
	
	render() {
		return (
            <MuiThemeProvider>
                <div className="profile-wrapper"> 
                    <div className="about-user">
                        {this.state.user.photo === null ? <img src={Placeholder} alt="profile" /> :
                            <div>
                                <img className="profile-pic" src={this.state.user.photo} alt="Actual Profile"/>
                            </div>
                        }
        		      <h1 className="username">{this.state.user.username}</h1>
                      <h1 className="applaued">I've been applaued {this.state.user.claps} time(s)</h1>
                        <div className="bio">{this.state.bio}</div>
                        {this.state.isUser ? (
                            <div>
                                <Link to={`/editprofile/${this.props.match.params.username}/${this.props.match.params.id}`}>
                                    <button className="edit-profile-btn">Edit Profile</button>
                                </Link> <br></br>
                                <Link className="add-collection-btn" to="/addcollection">Add a new Collection</Link>
                            </div>
                        ) : (
                            null
                        )}
                        {!this.state.isUser ? (
                            <div className="add-friend-div">
                                <AddFriendBtn className="add-friend-btn"
                                    onClick={() => this.addFriend(
                                        this.props.match.params.id, 
                                        this.props.match.params.username,
                                        this.state.currentUser.username
                                    )} 
                                />
                                <div className="clap-div" onClick={ () => 
                                    this.handleClap(this.state.user.id, this.state.currentUser.username)}
                                >
                                    <Clap
                                        isClicked={this.state.isClicked}
                                        maxCount={1}
                                        theme={{
                                            secondaryColor: '#5f27ae'
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            null
                        )}
                    </div>
                    <div className="friends-div">
                        {this.state.friends.length ? (
                           <List>
                           <Subheader>Followers</Subheader>
                                {this.state.friends.map(friend => (    
                                    <ListItem
                                        key={friend.friendId}
                                        primaryText={friend.username}
                                        onClick={() => this.getNextUser(friend.username, friend.friendId)}
                                        secondaryText={
                                            <p>
                                                {this.state.isUser ? (
                                                    <DeleteCollectBtn className="delete" onClick={() => this.deleteFriend(friend.friendId)} />
                                                ) : (
                                                        null
                                                    )}
                                            </p>
                                        } 
                                        secondaryTextLines={2}
                                    />     
                                ))}
                           </List>
                        ) : (
                                <h3>Click the button above to start sharing your collections!</h3>
                            )}
                    </div>
                    {this.state.isUser ? (
                        
                           <div className="notifications-div">
                                <h1 className="notification-title">Notifications</h1>
                                    {this.state.notifications.length ? (
                                        <NotificationList>
                                            {this.state.notifications.map(notification => (
                                                    <NotificationListItem 
                                                        key={notification.id}
                                                        id={notification.id} 
                                                        message={notification.message} 
                                                        friendId={notification.friendId}
                                                        friendUsername={notification.friendUsername}
                                                        onClick={() => this.getNextUser(notification.friendUsername, notification.friendId)}
                                                    >
                                                        <Link className="notification-item" to={`/profile/${notification.friendUsername}/${notification.id}`}>
                                                            <div>{notification.message}</div>
                                                        </Link>
                                                    </NotificationListItem>
                                                
                                            ))}
                                        </NotificationList>
                                ) : (
                                        <h3>You don't have any notifications yet</h3>
                                    )}
                            </div>
                       
                     ) : (
                            null
                        )}
                    <div className="collections-div">
                        {this.state.collections.length ? (
                            <CollectionList>
                                {this.state.collections.map(collection => (
                                    <CollectionListItem 
                                        key={collection.title}
                                        id={collection.id} 
                                        title={collection.title} 
                                        description={collection.description}
                                    >
                                        {this.state.isUser ? (
                                            <DeleteCollectBtn className="delete" onClick={() => this.deleteCollection(collection.id)} />
                                        ) : (
                                                null
                                            )}
                                    </CollectionListItem>
                                ))}
                            </CollectionList>
                    ) : (
                            <h3>Click the button above to start sharing your collections!</h3>
                        )}
                </div>
            </div>
            <MuiThemeProvider>
                <Snackbar
                    open={this.state.open}
                    message="Friend Added!"
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
                </MuiThemeProvider>
            </MuiThemeProvider>
		);
	}
}

export default withRouter(Profile);