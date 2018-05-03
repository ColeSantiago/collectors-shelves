import React, { Component } from "react";
import {withRouter} from 'react-router';
import { Link } from "react-router-dom";

import API from "../../utils/API";
import "./Dashboard.css";

// components
import Wrapper from "../../components/Wrapper";
// import Nav from "../../components/Nav";
import { List, ListItem } from "../../components/ArticleList";
import { SearchInput, SearchFormBtn } from "../../components/SearchForm";
import { PhotoList, PhotoListItem } from "../../components/PhotoListDashboard";

// material ui
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  toggle: {
    marginBottom: 16,
  },
  thumbOff: {
    backgroundColor: '#ffcccc',
  },
  trackOff: {
    backgroundColor: '#ff9d9d',
  },
  thumbSwitched: {
    backgroundColor: 'red',
  },
  trackSwitched: {
    backgroundColor: '#ff9d9d',
  },
  labelStyle: {
    color: 'red',
  },
};

class Dashboard extends Component {
	state = {
		user: [],
        articles: [],
        activity: [],
        articleLimit: 10,
        photoLimit: 10,
        toggled: false,
        searchText: '',
        searchResults: [],
        loading: true
	};

    componentDidMount() {
        setTimeout(() => this.setState({ loading: false }), 4000);
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

    onToggle = () => {
        if (this.state.toggled === false) {
            this.setState({toggled: true})
        } else {
            this.setState({toggled: false})
        }   
    };

    // loads 10 more photos to the dashboard when clicked
    loadMore () {
        this.setState({photoLimit: this.state.photoLimit + 10});
        this.getcurrentUserAndActivity();
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    };

    // handles the form submit search photos
    handleSearchSubmit = event => { 
        event.preventDefault();
        if (this.state.searchText.length) {
          API.search({
            searchText: this.state.searchText
          })
          .then(res => this.setState({searchResults: res.data.searchResults}))
          .catch(err => console.log(err));
        }
    };
	
	render() {
        const { loading } = this.state;
    
        if(loading) {
          return (
            <MuiThemeProvider>
                <CircularProgress size={80} thickness={5} />
            </MuiThemeProvider>
          ); 
        }
		return (
            <MuiThemeProvider>
    		  <Wrapper>
                <div className="dashboard-wrapper">
                    <div className="user-area">
                        <div className="user-info">  
                            <h1>Hey {this.state.user.username}</h1>
                        </div>
                      	<Link className="go-to-profile" to={`/profile/${this.state.user.username}/${this.state.user.id}`}>
                            Go To Your Profile
                        </Link>
                    </div>
                    <div className="article-div">
                        {this.state.articles.length ? (
                            <List>
                                <h1 className="article-title">Recent Articles from <a href="http://news.toyark.com/" rel="noopener noreferrer" target="_blank">Toyark.com</a></h1>
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
                        {!this.state.toggled ? (
                            <div className="activity-div">
                                <Toggle
                                    style={styles.toggle}
                                    toggled={this.state.toggled}
                                    onToggle={this.onToggle}
                                />
                                {this.state.activity.length ? (
                                    <PhotoList>
                                        <div className="title">Collector's Shelves</div>
                                        <h1 className="recent-activity">Recent User Activity</h1>
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
                        ) : (
                                <div className="search-div">
                                    <Toggle
                                        style={styles.toggle}
                                        toggled={this.state.toggled}
                                        onToggle={this.onToggle}
                                    />
                                    <form>
                                      <SearchInput
                                            value={this.state.searchText}
                                            onChange={this.handleInputChange}
                                            name="searchText"
                                            floatingLabelText="Search"
                                          /> 
                                        <SearchFormBtn className="search-btn" onClick={this.handleSearchSubmit} />
                                    </form>
                                    {this.state.searchResults.length ? (
                                        <PhotoList>
                                                {this.state.searchResults.slice(0, this.state.photoLimit).map(photo => (
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
                                    ): (
                                            <p className="no-results">No Results. Add titles to your photos so people can discover you!</p>
                                        )}
                                </div>
                            )}
                    </div>        
    		  </Wrapper>
          </MuiThemeProvider>
		);
	}
}

export default withRouter(Dashboard);