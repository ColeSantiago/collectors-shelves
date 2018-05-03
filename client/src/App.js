import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Redirect, withRouter } from "react-router";

import VerticalNonLinear from "./components/VerticalNonLinear"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import API from "./API";
import "./App.css";
import Favicon from 'react-favicon';

// components
import { Input, SignInBtn } from "./SignInForm";
// import Footer from "./components/Footer";

// pages
import AddCollection from "./pages/AddCollection";
import Collection from "./pages/Collection";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import EditPhoto from "./pages/EditPhoto";
import EditProfile from "./pages/EditProfile";

// the sign out button
const AuthButton = withRouter(({ history }) => (
  Auth.isAuthenticated ? (
    <MuiThemeProvider>
        <div className="signout-div">
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'left', vertical: 'top'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
            >
                <Link className="navbar-link" to="/dashboard">
                    <MenuItem primaryText="Home"/>
                </Link>
                <MenuItem 
                    onClick={() => {
                        Auth.signout(() => history.push('/'))
                    }} primaryText="Sign Out" />
            </IconMenu> 
        </div>
    </MuiThemeProvider>
  ) : (
    null
  )
));

// checks isAuthenticated, updates session storage
const Auth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // async
    sessionStorage.setItem('isAuthenticated', 'true');
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100) // async
    sessionStorage.setItem('isAuthenticated', 'false');
  }
}

// protected route for non logged in users
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    Auth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

// the sign in page
class SignIn extends Component {
    state = {
        userName: "",
        password: "",
        redirectToReferrer: false,
        user: []
    };

    componentDidMount() {
      let isLoggedIn = sessionStorage.getItem('isAuthenticated');
      if (isLoggedIn === 'true') {
        Auth.authenticate(() => {
          this.setState(() => ({
            redirectToReferrer: true
          }))
        })
      }
    };

    // login function
    login = () => {
        Auth.authenticate(() => {
          this.setState(() => ({
            redirectToReferrer: true
          }))
        })
    };

    // handles form input
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    // form submit to login user and set the states to true
    handleFormSubmit(event) {
        event.preventDefault();
        API.loginUser({
            username: this.state.userName,
            password: this.state.password,
        })
        .then(res => {
            if(res.data.login_status === true) {
                Auth.authenticate(() => {
                    this.setState(() => ({
                        redirectToReferrer: true
                    }))
                })
                this.setState({ user: res.data})     
        }})
        .catch(err => console.log(err));
    };

    render() {
        return(
            <div className="wrapper">
                <h1 className="title">Collector-Shelves.com</h1>
                <MuiThemeProvider>
                    {this.state.redirectToReferrer === false ?
                        <div className="sign-in-div">
                             <div className="vertical">
                                <MuiThemeProvider>
                                    <VerticalNonLinear />
                                </MuiThemeProvider>
                            </div>
                            <form className="sign-in-form" onSubmit={this.handleFormSubmit.bind(this)}>
                                <Input
                                    value={this.state.userName}
                                    onChange={this.handleInputChange}
                                    name="userName"
                                    hintText="Username"
                                    floatingLabelText="Username"
                                    floatingLabelFixed={true}
                                />
                                <Input
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    hintText="Password"
                                    floatingLabelText="Password"
                                    floatingLabelFixed={true}
                                    name="password"
                                    type="password"
                                />
                                <SignInBtn className="sign-in" type="submit" />
                            <Link className="sign-up" to="/signup">
                                Sign Up
                            </Link>
                            
                            </form>
                        </div>
                    :null}
                </MuiThemeProvider>
                {this.state.redirectToReferrer === true ?
                    <Link className="to-dashboard" to="/dashboard">
                        <p>Login Successful</p>
                        <p>Go To Your Dashboard</p>
                    </Link>
                :null}
            </div>
        );
    }
}

// all of the routes and protected routes, renders the pages
const App = () => (
  <Router>
    <div>
        <Favicon url="https://www.favicon.cc/logo3d/77885.png" />
        <AuthButton />
        <Switch>
   		   <Route exact path="/" component={SignIn} />
   		   <Route exact path="/signup" component={SignUp} />
   		   <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/profile/:username/:id" component={Profile} />
            <PrivateRoute exact path="/addcollection" component={AddCollection} />
            <PrivateRoute exact path="/collection/:id" component={Collection} />
            <PrivateRoute exact path="/editphoto/:id" component={EditPhoto} />
            <PrivateRoute exact path="/editprofile/:username/:id" component={EditProfile} />
        </Switch> 
    </div>
  </Router>
);

export default App;


