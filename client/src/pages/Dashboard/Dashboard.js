import React, { Component } from "react";
import API from "../../utils/API";
import Wrapper from "../../components/Wrapper";
import Nav from "../../components/Nav";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import { List, ListItem } from "../../components/List";
import { PhotoList, PhotoListItem } from "../../components/PhotoList";
import {withRouter} from 'react-router';

class Dashboard extends Component {
	state = {
		user: [],
        articles: [],
        activity: []
	};

    componentDidMount() {
  		this.getcurrentUserAndActivity();
        // this.scrapeArticles();
  	};		

  	getcurrentUserAndActivity = () => {
  		API.getUserAndActivity()
    	.then(res => {
    		this.setState({ user: res.data.user, activity: res.data.activity })
   		})
    	.catch(err => console.log(err));
  	};

    scrapeArticles = () => {
        API.scrapeArticles()
        .then(res => {
            this.setState({articles: res.data.articles})
        })
        .catch(err => console.log(err));
    };
	
	render() {
		return (
		  <Wrapper>
            <MuiThemeProvider>
                <Nav />
            </MuiThemeProvider>
          		
            <h1>hey {this.state.user.username}</h1>
          		<Link to={`/profile/${this.state.user.username}/${this.state.user.id}`}>
                    Go To Your Profile
                </Link>
            <div className="article-div">
                {this.state.articles.length ? (
                    <List>
                        {this.state.articles.map(article => (
                            <ListItem 
                                key={article.id} 
                                title={article.title} 
                                link={article.link}
                            />
                        ))}
                    </List>
                ) : (
                    null
                )}
            </div>
                <div className="activity-div">
                    {this.state.activity.length ? (
                        <PhotoList>
                            {this.state.activity.map(photo => (
                                <PhotoListItem 
                                    key={photo.id}
                                    id={photo.id}
                                    collectionId={photo.collectionId}
                                    url={photo.photo_link}
                                    title={photo.title}
                                    likes={photo.likes}     
                                >
                                </PhotoListItem>
                            ))}
                        </PhotoList>
                    ) : (
                        null
                    )}
                </div>
		  </Wrapper>
		);
	}
}

export default withRouter(Dashboard);