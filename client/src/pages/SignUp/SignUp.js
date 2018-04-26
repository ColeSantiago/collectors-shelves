import React, { Component } from "react";
import { Input, SignUpBtn } from "../../components/SignUpForm";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

class SignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: ""
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.password === this.state.confirmPassword) {
      API.createUser({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        username: this.state.userName,
        password: this.state.password,
      })
      .then(res => res.redirect('/'))
      .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <div>
      <h1>Start showing off your collection!</h1>
        <MuiThemeProvider>
          <form>
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
                  <SignUpBtn onClick={this.handleFormSubmit} />
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