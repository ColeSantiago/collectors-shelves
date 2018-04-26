import React, { Component } from "react";
import { Input, FormBtn } from "../../components/Input";
import API from "../../utils/API";
import { Link, Redirect } from "react-router-dom";

class SignIn extends Component {
    state = {
        userName: "",
        password: ""
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleFormSubmit = event => {
        event.preventDefault();
        API.loginUser({
            username: this.state.userName,
            password: this.state.password,
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    };

    render() {
        return(
            <div>
                <form>
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
                    <FormBtn
                        onClick={this.handleFormSubmit}
                    >
                        Sign In
                    </FormBtn>
                <Link className="navbar-link" to="/signup">
                    Sign Up
                </Link>
                </form>
            </div> 
        );
    }
}

export default SignIn;