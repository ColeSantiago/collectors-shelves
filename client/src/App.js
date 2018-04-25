import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Redirect, withRouter } from "react-router";
import { Input, FormBtn } from "./Input";
import API from "./API";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import AddCollection from "./pages/AddCollection";
// import Collection from "./pages/Collection";
import Dashboard from "./pages/Dashboard";
// import HomePage from "./pages/HomePage";
// import Profile from "./pages/Profile";
// import Search from "./pages/Search";
import SignUp from "./pages/SignUp";
// import SignIn from "./pages/SignIn";
// import UpdateCollection from "./pages/UpdateCollection";
// import Footer from "./components/Footer";

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
));

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
    localStorage.setItem('isAuthenticated', 'true');
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100) // fake async
    localStorage.setItem('isAuthenticated', 'false');
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
      let isLoggedIn = localStorage.getItem('isAuthenticated');
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
        if (this.state.redirectToReferrer) {
            return <Redirect to='/dashboard'/>;
        }
        return(
            <MuiThemeProvider>
                {this.state.redirectToReferrer === false ?
                    <form onSubmit={this.handleFormSubmit.bind(this)}>
                        <Input
                            value={this.state.userName}
                            onChange={this.handleInputChange.bind(this)}
                            name="userName"
                            hintText="Username Field"
                            floatingLabelText="Username"
                        />
                        <Input
                            value={this.state.password}
                            onChange={this.handleInputChange.bind(this)}
                            hintText="Password Field"
                            floatingLabelText="Password"
                            name="password"
                            type="password"
                        />
                        <FormBtn
                            type="submit"
                        >
                            Sign In
                        </FormBtn>
                    <Link className="navbar-link" to="/signup">
                        Sign Up
                    </Link>
                    <AuthButton />
                    </form>
                :null}

                {this.state.redirectToReferrer === true ?
                    <Link className="navbar-link" to="/dashboard">
                        Go To Your Dashboard
                    </Link>
                :null}
            </MuiThemeProvider> 
        );
    }
}

const App = () => (
  <Router>
    <div>
      <Switch>
   		<Route exact path="/" component={SignIn} />
   		<Route exact path="/signup" component={SignUp} />
   		<PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/add-collection" component={AddCollection} />
      </Switch>
    </div>
  </Router>
);

export default App;


