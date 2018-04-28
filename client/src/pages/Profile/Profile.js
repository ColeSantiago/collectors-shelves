import React, { Component } from "react";
import API from "../../utils/API";
import { Input, UserDetailsBtn } from "../../components/UserDetailsForm";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import { List, ListItem } from "../../components/List";
import Wrapper from "../../components/Wrapper";
import DeleteCollectBtn from "../../components/DeleteCollectBtn";

class Dashboard extends Component {
	state = {
		user: [],
        editBio: "",
        collections: []

	};

    componentDidMount() {
  		this.currentUser();
        this.getCollections();
  	};		

    currentUser = () => {
        API.getUser()
        .then(res => {
            this.setState({ user: res.data.user })
        })
        .catch(err => console.log(err));
    };

    getCollections = () => {
        API.loadAllCollections()
        .then(res => this.setState({ collections: res.data }))
        .catch(err => console.log(err));
    };

    // goToCollection = (id) => {
    //     const selectedCollection = this.state.collections.find(collection => collection.id === id);
    //     console.log(selectedCollection.id);
    //     API.loadCollection(selectedCollection.id)
    //     .then(res => console.log('on profile'))
    //     .catch(err => console.log(err));
    // };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    };

    handleFormSubmit = event => {
        event.preventDefault();
        if (this.state.editBio.length) {
          API.updateBio({
            bio: this.state.editBio
          })
          .then(res => console.log(res))
          .catch(err => console.log(err));
        }
    };
	
	render() {
		return (
            <Wrapper>
		      <h1>{this.state.user.username}</h1>
                <div>{this.state.user.bio}</div>
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
            <Link to="/addcollection">
                Add a new Collection
            </Link>
            <div className="collections">
                {this.state.collections.length ? (
                    <List>
                        {this.state.collections.map(collection => (
                            <ListItem 
                                key={collection.id}
                                id={collection.id} 
                                title={collection.title} 
                                description={collection.description}
                                
                            >
                                <DeleteCollectBtn onClick={() => this.deleteCollection(collection._id)} />
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

export default Dashboard;