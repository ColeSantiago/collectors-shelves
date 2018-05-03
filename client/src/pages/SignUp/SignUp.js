import React, { Component } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/API";
import { Input, SignUpBtn } from "../../components/SignUpForm";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "./SignUp.css";

class SignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
  };

  // handles form input
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // handles form submit to create a user
  handleFormSubmit = event => {
    if (this.state.firstName.length &&
        this.state.lastName.length &&
        this.state.email.length &&
        this.state.userName.length &&
        this.state.password.length &&
        this.state.password === this.state.confirmPassword
      ) {
      API.createUser({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        username: this.state.userName,
        password: this.state.password,
      })
      .then(res => console.log('user created'))
      .catch(err => console.log(err));
    } else {
      alert("Please fill in all areas and check your password and email");
    }
  };

  render() {
    return (
      <div>
      <h1 className="start">Start showing off your collection!</h1>
        <MuiThemeProvider>
          <form className="sign-up-form">
              <Input
                  value={this.state.firstName}
                    onChange={this.handleInputChange}
                    name="firstName"
                    floatingLabelText="First Name"
                  />
                  <Input
                    value={this.state.lastName}
                    onChange={this.handleInputChange}
                    name="lastName"
                    floatingLabelText="Last Name"
                  />
                  <Input
                    value={this.state.email}
                    onChange={this.handleInputChange}
                    name="email"
                    floatingLabelText="Email"
                  />
                  <Input
                    value={this.state.userName}
                    onChange={this.handleInputChange}
                    name="userName"
                    floatingLabelText="Username"
                  />
                  <Input
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    name="password"
                    type="password"
                    floatingLabelText="Password"
                  />
                  <Input
                    value={this.state.confirmPassword}
                    onChange={this.handleInputChange}
                    name="confirmPassword"
                    type="password"
                    floatingLabelText="Confirm Password"
                  />
                  <Link className="nevermind-link" to="/">
                    <SignUpBtn onClick={this.handleFormSubmit} />
                  </Link>
                  <Link className="nevermind-link" to="/">
                    Nevermind..
                  </Link>
            </form>
        </MuiThemeProvider>
      </div> 
    );
  }
}

export default SignUp;