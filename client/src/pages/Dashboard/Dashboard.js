import React, { Component } from "react";
import API from "../../utils/API";
import Wrapper from "../../components/Wrapper";
import Nav from "../../components/Nav";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router-dom";
import { List, ListItem } from "../../components/List";
import {withRouter} from 'react-router';

class Dashboard extends Component {
	state = {
		user: [],
        articles: []
	};

    componentDidMount() {
  		this.currentUser();
        // this.scrapeArticles();
  	};		

  	currentUser = () => {
  		API.getUser()
    	.then(res => {
    		this.setState({ user: res.data.user })
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
          		<Link to="/profile">
                    Go To Your Profile
                </Link>
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
		  </Wrapper>
		);
	}
}

export default withRouter(Dashboard);