import React, { Component } from "react";
import API from "../../utils/API";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import { List, ListItem } from "../../components/List";
import Wrapper from "../../components/Wrapper";
import DeleteCollectBtn from "../../components/DeleteCollectBtn";
import {withRouter} from "react-router";
import AddFriendBtn from "../../components/AddFriendBtn";
import Placeholder from "./placeholder.png"

class Dashboard extends Component {
	state = {
		user: [],
        bio: "",
        collections: [],
        friends: [],
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
                friends: res.data.friends
            })
        })
        .catch(err => console.log(err));
    };

    deleteCollection = id => {
        API.deleteCollection({
            id: id
        })
        .then(res => console.log("collection deleted"))
        .catch(err => console.log(err));
    };

    addFriend(id, username) {
        API.addFriend({
            friendId: id,
            username: username
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
    }
	
	render() {
		return (
            <Wrapper>
                {this.state.user.photo === null ? <img src={Placeholder} alt="profile picture" /> :
                    <div>
                        <img src={this.state.user.photo} alt="Actual Profile Picture"/>
                    </div>
                }
		      <h1>{this.state.user.username}</h1>
                <div>{this.state.bio}</div>
                <Link to={`/editprofile/${this.props.match.params.username}/${this.props.match.params.id}`}>
                    <button>Edit Profile</button>
                </Link>
                <AddFriendBtn 
                    onClick={() => this.addFriend(this.props.match.params.id, this.props.match.params.username)} 
                />
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
                                    <DeleteCollectBtn onClick={() => this.deleteFriend(friend.friendId)} />
                                </ListItem>
                            ))}

                        </List>
                    ) : (
                    <h3>Click the button above to start sharing your collections!</h3>
                    )}
                </div>
                <div className="liked-photos">Liked Photos here</div>
                <div className="notifiction-div">Notifictions here</div>
            <Link to="/addcollection">
                Add a new Collection
            </Link>
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
                                <DeleteCollectBtn onClick={() => this.deleteCollection(collection.id)} />
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