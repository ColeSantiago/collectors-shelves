import React, { Component } from "react";
import {withRouter} from 'react-router';
import { Link } from "react-router-dom";

import API from "../../utils/API";
import "./Dashboard.css";

// components
import Wrapper from "../../components/Wrapper";
import Nav from "../../components/Nav";
import { List, ListItem } from "../../components/ArticleList";
import { PhotoList, PhotoListItem } from "../../components/PhotoListDashboard";

// material ui
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Divider from 'material-ui/Divider';

class Dashboard extends Component {
	state = {
		user: [],
        articles: [],
        activity: [],
        articleLimit: 10,
        photoLimit: 10
	};

    componentDidMount() {
  		this.getcurrentUserAndActivity();
  	};		

    // gets the current user, articles, and all uploads
  	getcurrentUserAndActivity = () => {
  		API.getUserAndActivity()
    	.then(res => {
    		this.setState({ 
                user: res.data.user, 
                activity: res.data.activity, 
                articles: res.data.articles 
            })
   		})
    	.catch(err => console.log(err));
  	};

    // loads 10 more photos to the dashboard when clicked
    loadMore () {
        console.log('clicked');
        this.setState({photoLimit: this.state.photoLimit + 10});
        this.getcurrentUserAndActivity();
    };
	
	render() {
		return (
            <MuiThemeProvider>
    		  <Wrapper>
                <div className="dashboard-wrapper"> 
                    <div className="user-info">  
                        <Nav username={this.state.user.username} id={this.state.user.id}/>
                        <h1>hey {this.state.user.username}</h1>
                    </div>
                  	<Link className="go-to-profile" to={`/profile/${this.state.user.username}/${this.state.user.id}`}>
                        Go To Your Profile
                    </Link>
                    <div className="article-div">
                        {this.state.articles.length ? (
                            <List>
                                {this.state.articles.slice(0, this.state.articleLimit).map(article => (
                                    <ListItem 
                                        key={article.id} 
                                        title={article.title} 
                                        link={article.link}
                                    >
                                        <Divider />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            null
                        )}
                    </div>
                        <div className="activity-div">
                            {this.state.activity.length ? (
                                <PhotoList>
                                    {this.state.activity.slice(0, this.state.photoLimit).map(photo => (
                                        <PhotoListItem 
                                            key={photo.id}
                                            id={photo.id}
                                            collectionId={photo.collectionId}
                                            url={photo.photo_link}
                                            title={photo.title}     
                                        >
                                        </PhotoListItem>
                                    ))}
                                    <button className="load-more-btn" onClick={this.loadMore.bind(this)}>
                                        Load More
                                    </button>
                                </PhotoList>
                            ) : (
                                null
                            )}
                        </div>
                    </div>
    		  </Wrapper>
          </MuiThemeProvider>
		);
	}
}

export default withRouter(Dashboard);