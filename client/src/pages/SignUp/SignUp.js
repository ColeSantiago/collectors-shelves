import React, { Component } from "react";
import { Input, FormBtn } from "../../components/Input";
import API from "../../utils/API";
import { Link } from "react-router-dom";

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
        <form>
            <Input
                value={this.state.firstName}
                  onChange={this.handleInputChange}
                  name="firstName"
                  placeholder="First Name"
                />
                <Input
                  value={this.state.lastName}
                  onChange={this.handleInputChange}
                  name="lastName"
                  placeholder="Last Name"
                />
                <Input
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  name="email"
                  placeholder="Email"
                />
                <Input
                  value={this.state.userName}
                  onChange={this.handleInputChange}
                  name="userName"
                  placeholder="Username"
                />
                <Input
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                <Input
                  value={this.state.confirmPassword}
                  onChange={this.handleInputChange}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                />
                <FormBtn
                  onClick={this.handleFormSubmit}
                >
                  Sign Up
                </FormBtn>
                <Link className="navbar-link" to="/">
                  Nevermind..
                </Link>
          </form>
      </div> 
    );
  }
}

export default SignUp;