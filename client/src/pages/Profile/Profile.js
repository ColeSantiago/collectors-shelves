import React, { Component } from "react";
import API from "../../utils/API";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import { List, ListItem } from "../../components/CollectionList";
import { NotificationList, NotificationListItem } from "../../components/NotificationList";
import Wrapper from "../../components/Wrapper";
import DeleteCollectBtn from "../../components/DeleteCollectBtn";
import {withRouter} from "react-router";
import AddFriendBtn from "../../components/AddFriendBtn";
import Placeholder from "./placeholder.png"
import Nav from "../../components/Nav";
import Clap from "react-clap-button";

class Dashboard extends Component {
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

    userSpecific = () => {
        if ( this.state.user.id === this.state.currentUser.id) {
            this.setState({isUser: true})
        } else {
            this.setState({isUser: false})
        }
    };

    deleteCollection = id => {
        API.deleteCollection({
            id: id
        })
        .then(res => console.log("collection deleted"))
        .catch(err => console.log(err));
        this.getUserAndCollections();
    };

    addFriend(id, username, friendUsername) {
        API.addFriend({
            friendId: id,
            username: username,
            friendUsername: friendUsername
        })
        .then(res => console.log('friend added'))
        .catch(err => console.log(err));
    };

    deleteFriend = id => {
        API.deleteFriend({
            friendId: id
        })
        .then(res => console.log("unfriended"))
        .catch(err => console.log(err));
        this.getUserAndCollections();
    }

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
            <Wrapper>
                <MuiThemeProvider>
                    <Nav username={this.state.user.username} id={this.state.user.id}/>
                </MuiThemeProvider>
                {this.state.user.photo === null ? <img src={Placeholder} alt="profile" /> :
                    <div>
                        <img src={this.state.user.photo} alt="Actual Profile"/>
                    </div>
                }
		      <h1>{this.state.user.username}</h1>
              <h1>I've been applaued {this.state.user.claps} time(s)</h1>
                <div>{this.state.bio}</div>
                {this.state.isUser ? (
                    <Link to={`/editprofile/${this.props.match.params.username}/${this.props.match.params.id}`}>
                        <button>Edit Profile</button>
                    </Link>
                ) : (
                    null
                )}
                {!this.state.isUser ? (
                    <div>
                        <AddFriendBtn 
                            onClick={() => this.addFriend(
                                                this.props.match.params.id, 
                                                this.props.match.params.username,
                                                this.state.currentUser.username
                                            )} 
                        />
                        <div onClick={() => this.handleClap(this.state.user.id, this.state.currentUser.username)}>
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
                <div className="collections">
                    {this.state.friends.length ? (
                        <List>
                            {this.state.friends.map(friend => (
                                <ListItem 
                                    key={friend.friendId}
                                    id={friend.friendId} 
                                    username={friend.username}    
                                >
                                <Link to={`/profile/${friend.username}/${friend.friendId}`}>
                                    {friend.username}
                                </Link>
                                    {this.state.isUser ? (
                                        <DeleteCollectBtn onClick={() => this.deleteFriend(friend.friendId)} />
                                    ) : (
                                            null
                                        )}
                                </ListItem>
                            ))}

                        </List>
                    ) : (
                    <h3>Click the button above to start sharing your collections!</h3>
                    )}
                </div>
                {this.state.isUser ? (
                    <div>
                       <div className="notifications">
                                {this.state.notifications.length ? (
                                    <NotificationList>
                                        {this.state.notifications.map(notification => (
                                            <NotificationListItem 
                                                key={notification.id}
                                                id={notification.id} 
                                                message={notification.message} 
                                                friendId={notification.friendId}
                                                friendUsername={notification.friendUsername}
                                            />
                                        ))}
                                    </NotificationList>
                            ) : (
                            <h3>You don't have any notifications yet</h3>
                            )}
                        </div>
                        <Link to="/addcollection">Add a new Collection</Link>
                    </div>
                 ) : (
                        null
                    )}
                <div className="collections">
                    {this.state.collections.length ? (
                        <List>
                            {this.state.collections.map(collection => (
                                <ListItem 
                                    key={collection.title}
                                    id={collection.id} 
                                    title={collection.title} 
                                    description={collection.description}
                                
                                >
                                    {this.state.isUser ? (
                                        <DeleteCollectBtn onClick={() => this.deleteCollection(collection.id)} />
                                    ) : (
                                            null
                                        )}
                                </ListItem>
                            ))}

                        </List>
                ) : (
                <h3>Click the button above to start sharing your collections!</h3>
                )}
            </div>
          </Wrapper>
		);
	}
}

export default withRouter(Dashboard);