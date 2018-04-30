import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Redirect, withRouter } from "react-router";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import API from "./API";

// components
import { Input, SignInBtn } from "./SignInForm";
import Footer from "./components/Footer";

// pages
import AddCollection from "./pages/AddCollection";
import Collection from "./pages/Collection";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import EditPhoto from "./pages/EditPhoto";
import EditProfile from "./pages/EditProfile";
// import Search from "./pages/Search";

// the sign out button
const AuthButton = withRouter(({ history }) => (
  Auth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        Auth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
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
            <div>
                <MuiThemeProvider>
                    {this.state.redirectToReferrer === false ?
                        <form onSubmit={this.handleFormSubmit.bind(this)}>
                            <Input
                                value={this.state.userName}
                                onChange={this.handleInputChange}
                                name="userName"
                                hintText="Username Field"
                                floatingLabelText="Username"
                                floatingLabelFixed={true}
                            />
                            <Input
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                hintText="Password Field"
                                floatingLabelText="Password"
                                floatingLabelFixed={true}
                                name="password"
                                type="password"
                            />
                            <SignInBtn type="submit" />
                        <Link className="navbar-link" to="/signup">
                            Sign Up
                        </Link>
                        
                        </form>
                    :null}
                </MuiThemeProvider>

                {this.state.redirectToReferrer === true ?
                    <Link className="navbar-link" to="/dashboard">
                        Go To Your Dashboard
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
      <Footer/>
    </div>
  </Router>
);

export default App;


