import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Redirect, withRouter } from "react-router";
import { Input, SignInBtn } from "./SignInForm";
import Footer from "./components/Footer";
// import Nav from "./components/Nav";
import API from "./API";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import AddCollection from "./pages/AddCollection";
import Collection from "./pages/Collection";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// import Search from "./pages/Search";
import SignUp from "./pages/SignUp";
// import Footer from "./components/Footer";
import EditPhoto from "./pages/EditPhoto";
import EditProfile from "./pages/EditProfile";

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    null
  )
));

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
    sessionStorage.setItem('isAuthenticated', 'true');
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100) // fake async
    sessionStorage.setItem('isAuthenticated', 'false');
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

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
        fakeAuth.authenticate(() => {
          this.setState(() => ({
            redirectToReferrer: true
          }))
        })
      }
    };

    login = () => {
        fakeAuth.authenticate(() => {
          this.setState(() => ({
            redirectToReferrer: true
          }))
        })
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleFormSubmit(event) {
        event.preventDefault();
        API.loginUser({
            username: this.state.userName,
            password: this.state.password,
        })
        .then(res => {
            if(res.data.login_status === true) {
                fakeAuth.authenticate(() => {
                    this.setState(() => ({
                        redirectToReferrer: true
                    }))
                })
                this.setState({ user: res.data})      
        }})
        .catch(err => console.log(err));
    };

    render() {

        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { redirectToReferrer } = this.state

        if (redirectToReferrer === true) {
          <Redirect to={"/profile"} />
        }

        if (redirectToReferrer === false) {
          <Redirect to={"/"} />
        }

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


